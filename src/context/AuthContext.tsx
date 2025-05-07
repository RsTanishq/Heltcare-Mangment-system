import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, mockDoctors } from '../data/mockDoctors';
import { Patient, mockPatients } from '../data/mockPatients';
import { BlockchainService } from '../services/blockchainService';

interface AuthContextType {
  currentUser: {
    type: 'doctor' | 'patient' | 'admin' | null;
    data: Doctor | Patient | null;
  };
  login: (email: string, password: string, type: 'doctor' | 'patient' | 'admin', walletAddress?: string) => Promise<boolean>;
  signup: (userData: any, type: 'doctor' | 'patient') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>({
    type: null,
    data: null
  });

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = async (userData: any, type: 'doctor' | 'patient'): Promise<boolean> => {
    try {
      // Create a new user object
      const newUser = {
        id: `${type[0].toUpperCase()}${Date.now()}`, // Generate a unique ID
        ...userData,
        createdAt: new Date().toISOString()
      };

      // Set the current user
      const userState = { type, data: newUser };
      setCurrentUser(userState);
      localStorage.setItem('currentUser', JSON.stringify(userState));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (
    email: string, 
    password: string, 
    type: 'doctor' | 'patient' | 'admin',
    walletAddress?: string
  ): Promise<boolean> => {
    try {
      // Initialize blockchain service
      const blockchainService = new BlockchainService();
      
      // For wallet-based login
      if (walletAddress) {
        // Verify user registration on blockchain
        const { isRegistered, details } = await blockchainService.verifyUserRegistration(walletAddress);
        
        if (!isRegistered) {
          throw new Error('User not registered in the blockchain');
        }

        // Get user data from IPFS
        const userData = await blockchainService.getUserData(walletAddress);
        
        if (!userData || details.role !== type) {
          throw new Error(`Not registered as a ${type}`);
        }

        // Create a proper user object with an ID
        const userState = {
          type,
          data: {
            ...userData,
            id: walletAddress.toLowerCase(), // Use wallet address as ID
            walletAddress: walletAddress.toLowerCase(),
          }
        };
        
        setCurrentUser(userState);
        localStorage.setItem('currentUser', JSON.stringify(userState));
        return true;
      }

      // Regular email/password login is not supported anymore
      // All logins must be through wallet
      throw new Error('Please use wallet login');
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear user data from context
      setCurrentUser({ type: null, data: null });
      
      // Clear all stored data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberedCredentials');
      localStorage.setItem('justLoggedOut', 'true');
      
      // If using blockchain service, disconnect wallet
      if (window.ethereum) {
        try {
          const blockchainService = new BlockchainService();
          await blockchainService.disconnectWallet();
        } catch (error) {
          console.error('Error disconnecting wallet:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 