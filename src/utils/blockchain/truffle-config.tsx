
// This file provides configuration and helper functions for working with Truffle
import { ethers } from 'ethers';

// Example Truffle configuration that would normally be in a truffle-config.js file
export const TRUFFLE_CONFIG = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,  // Default Ganache port
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.9"
    }
  }
};

// Helper function to get contract artifacts
export const getContractArtifact = (contractName: string) => {
  // In a real application, this would dynamically import contract artifacts
  // For now, we'll return the healthcare contract ABI as an example
  if (contractName === "HealthcareRecord") {
    return {
      contractName: "HealthcareRecord",
      abi: [
        // Contract ABI would be here, using the existing healthcare contract ABI
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "patient",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "recordId",
              "type": "string"
            }
          ],
          "name": "RecordAdded",
          "type": "event"
        }
        // Rest of ABI would continue here
      ],
      // Add bytecode property which was missing
      bytecode: "0x608060405234801561001057600080fd5b50610c9b806100206000396000f3fe..." // This would be the actual bytecode in a real application
    };
  }
  
  return null;
};

// Helper function to deploy contract using Truffle abstractions
export const deployContract = async (
  contractName: string, 
  provider: any, 
  constructorArgs: any[] = []
) => {
  try {
    const artifact = getContractArtifact(contractName);
    if (!artifact) {
      throw new Error(`Contract ${contractName} not found`);
    }
    
    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(
      artifact.abi,
      artifact.bytecode || "", // In a real app, bytecode would come from the artifact
      signer
    );
    
    const contract = await factory.deploy(...constructorArgs);
    await contract.deployed();
    
    return {
      success: true,
      contractAddress: contract.address
    };
  } catch (error: any) {
    console.error(`Error deploying ${contractName}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Simulating Ganache connection utility
export const connectToGanache = async () => {
  try {
    // In a browser environment with MetaMask, we would check if already connected to Ganache
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Check if we're on a local network (Ganache typically has chainId 1337)
      if (network.chainId === 1337) {
        return {
          success: true,
          message: "Already connected to Ganache"
        };
      }
      
      // Request switch to Ganache network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // 1337 in hex
        });
        return {
          success: true,
          message: "Switched to Ganache network"
        };
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x539', // 1337 in hex
                  chainName: 'Ganache Local',
                  rpcUrls: ['http://127.0.0.1:7545'],
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                },
              ],
            });
            return {
              success: true,
              message: "Added and switched to Ganache network"
            };
          } catch (addError) {
            return {
              success: false,
              error: "Could not add Ganache network"
            };
          }
        }
        return {
          success: false,
          error: "Could not switch to Ganache network"
        };
      }
    }
    
    return {
      success: false,
      error: "No Ethereum wallet found"
    };
  } catch (error: any) {
    console.error("Error connecting to Ganache:", error);
    return {
      success: false,
      error: error.message || "Could not connect to Ganache"
    };
  }
};
