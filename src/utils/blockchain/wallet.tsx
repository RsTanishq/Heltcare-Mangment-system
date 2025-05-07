import { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

interface WalletState {
  account: string | null;
  balance: string;
  connected: boolean;
  networkName: string;
}

export const useEthereumWallet = () => {
  // Initialize state from localStorage if available
  const getInitialState = (): WalletState => {
    const saved = localStorage.getItem('walletState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      account: null,
      balance: "0",
      connected: false,
      networkName: ""
    };
  };

  const [account, setAccount] = useState<string | null>(getInitialState().account);
  const [balance, setBalance] = useState<string>(getInitialState().balance);
  const [provider, setProvider] = useState<any>(null);
  const [connected, setConnected] = useState<boolean>(getInitialState().connected);
  const [error, setError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>(getInitialState().networkName);

  // Save state to localStorage whenever it changes
  const saveState = (state: WalletState) => {
    localStorage.setItem('walletState', JSON.stringify(state));
  };

  // Update state and persist
  const updateState = (newState: Partial<WalletState>) => {
    const state = {
      account: newState.account ?? account,
      balance: newState.balance ?? balance,
      connected: newState.connected ?? connected,
      networkName: newState.networkName ?? networkName
    };
    
    if (newState.account !== undefined) setAccount(newState.account);
    if (newState.balance !== undefined) setBalance(newState.balance);
    if (newState.connected !== undefined) setConnected(newState.connected);
    if (newState.networkName !== undefined) setNetworkName(newState.networkName);
    
    saveState(state);
  };

  const connectWallet = async () => {
    try {
      setError(null);
      
      if (!window.ethereum) {
        setError("No Ethereum wallet detected. Please install MetaMask.");
        return false;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethProvider = new BrowserProvider(window.ethereum);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setProvider(ethProvider);
        
        const rawBalance = await ethProvider.getBalance(address);
        const formattedBalance = formatEther(rawBalance);
        
        // Get network information
        const network = await ethProvider.getNetwork();
        const networkNames: {[key: number]: string} = {
          1: "Ethereum Mainnet",
          3: "Ropsten Testnet",
          4: "Rinkeby Testnet",
          5: "Goerli Testnet",
          42: "Kovan Testnet",
          1337: "Ganache Local"
        };
        
        const newNetworkName = networkNames[Number(network.chainId)] || `Chain ID: ${network.chainId}`;
        
        // Update all state at once
        updateState({
          account: address,
          balance: parseFloat(formattedBalance).toFixed(4),
          connected: true,
          networkName: newNetworkName
        });
        
        return true;
      } else {
        setError("No accounts found. Please connect your wallet.");
        return false;
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
      return false;
    }
  };
  
  const disconnectWallet = () => {
    updateState({
      account: null,
      balance: "0",
      connected: false,
      networkName: ""
    });
    setProvider(null);
    setError(null);
    localStorage.removeItem('walletState');
  };
  
  useEffect(() => {
    // Check if we should auto-connect
    const checkConnection = async () => {
      if (connected && window.ethereum) {
        try {
          const ethProvider = new BrowserProvider(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setProvider(ethProvider);
            const rawBalance = await ethProvider.getBalance(accounts[0]);
            updateState({
              balance: parseFloat(formatEther(rawBalance)).toFixed(4)
            });
          } else {
            disconnectWallet();
          }
        } catch (err) {
          console.error("Error checking connection:", err);
          disconnectWallet();
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          if (provider) {
            const rawBalance = await provider.getBalance(accounts[0]);
            updateState({
              account: accounts[0],
              balance: parseFloat(formatEther(rawBalance)).toFixed(4),
              connected: true
            });
          }
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        // Reload the page when the chain changes
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [provider, connected]);

  return {
    account,
    balance,
    provider,
    connected,
    error,
    networkName,
    connectWallet,
    disconnectWallet
  };
};
