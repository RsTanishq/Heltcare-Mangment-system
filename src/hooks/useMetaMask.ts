import { useState, useEffect } from 'react';
import { ethers, JsonRpcProvider, formatEther, parseEther } from 'ethers';

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
    balance: '0',
    chainId: null,
  });

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('MetaMask is not installed');
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });

          setState({
            isConnected: true,
            account: accounts[0],
            balance: formatEther(balance),
            chainId,
          });
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setState(prev => ({
        ...prev,
        account: accounts[0] || null,
        isConnected: accounts.length > 0,
      }));
    });

    // Listen for chain changes
    window.ethereum.on('chainChanged', (chainId: string) => {
      setState(prev => ({
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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      setState({
        isConnected: true,
        account: accounts[0],
        balance: formatEther(balance),
        chainId,
      });

      return accounts[0];
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  };

  const sendTransaction = async (to: string, amount: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value: parseEther(amount),
      });
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

  return {
    ...state,
    connect,
    sendTransaction,
  };
}; 