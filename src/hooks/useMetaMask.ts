import { useState, useEffect } from "react";
import { ethers, JsonRpcProvider, formatEther, parseEther } from "ethers";

interface MetaMaskState {
  isConnected: boolean;
  account: string | null;
  balance: string;
  chainId: string | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    account: null,
    balance: "0",
    chainId: null,
  });

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("MetaMask is not installed");
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });

          setState({
            isConnected: true,
            account: accounts[0],
            balance: formatEther(balance),
            chainId,
          });
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
      }
    };

    checkConnection();

    // Listen for account changes
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      setState((prev) => ({
        ...prev,
        account: accounts[0] || null,
        isConnected: accounts.length > 0,
      }));
    });

    // Listen for chain changes
    window.ethereum.on("chainChanged", (chainId: string) => {
      setState((prev) => ({
        ...prev,
        chainId,
      }));
    });

    return () => {
      window.ethereum.removeAllListeners();
    };
  }, []);

  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      setState({
        isConnected: true,
        account: accounts[0],
        balance: formatEther(balance),
        chainId,
      });

      return accounts[0];
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw error;
    }
  };

  const sendTransaction = async (to: string, amount: string) => {
    try {
      console.log(`Preparing to send ${amount} ETH to ${to}`);

      // Ensure MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed");
      }

      // Request accounts to ensure MetaMask is unlocked and connected
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const fromAddress = await signer.getAddress();

      console.log(`Sending from: ${fromAddress}`);

      // Get current gas price
      const feeData = await provider.getFeeData();
      console.log("Current gas price:", feeData.gasPrice?.toString());

      // Convert amount to Wei
      const valueInWei = parseEther(amount);
      console.log(`Amount in Wei: ${valueInWei.toString()}`);

      // Create transaction with explicit gas settings
      const txRequest = {
        to: to,
        value: valueInWei,
        // Set gas price slightly higher than current to ensure transaction goes through
        gasPrice: feeData.gasPrice
          ? (feeData.gasPrice * BigInt(12)) / BigInt(10)
          : undefined, // 1.2x current gas price
      };

      console.log("Transaction request:", txRequest);

      // Send transaction
      const tx = await signer.sendTransaction(txRequest);
      console.log("Transaction sent:", tx);

      // Wait for transaction to be mined
      console.log("Waiting for transaction to be mined...");
      const receipt = await tx.wait();
      console.log("Transaction mined! Receipt:", receipt);

      // Update balance after transaction
      const newBalance = await provider.getBalance(fromAddress);
      setState((prev) => ({
        ...prev,
        balance: formatEther(newBalance),
      }));

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error);
      // Log more detailed error information
      if (error.code) {
        console.error(`Error code: ${error.code}`);
      }
      if (error.message) {
        console.error(`Error message: ${error.message}`);
      }
      if (error.data) {
        console.error(`Error data:`, error.data);
      }
      throw error;
    }
  };

  return {
    ...state,
    connect,
    sendTransaction,
  };
};
