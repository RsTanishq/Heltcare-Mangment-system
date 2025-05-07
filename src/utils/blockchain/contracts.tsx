
import { ethers } from 'ethers';

export interface DeploymentOptions {
  contractName: string;
  contractABI: ethers.ContractInterface;
  contractBytecode: string;
  constructorArgs?: any[];
}

export interface ContractInteractionOptions {
  contractAddress: string;
  contractABI: ethers.ContractInterface;
  method: string;
  params?: any[];
  value?: string;
}

export const deploySmartContract = async (
  provider: ethers.providers.Web3Provider,
  options: DeploymentOptions
): Promise<{success: boolean, contractAddress?: string, error?: string}> => {
  try {
    const signer = provider.getSigner();
    
    const factory = new ethers.ContractFactory(
      options.contractABI,
      options.contractBytecode,
      signer
    );
    
    const contract = await factory.deploy(...(options.constructorArgs || []));
    
    await contract.deployed();
    
    return {
      success: true,
      contractAddress: contract.address
    };
  } catch (error: any) {
    console.error("Contract deployment error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const interactWithContract = async (
  provider: ethers.providers.Web3Provider,
  options: ContractInteractionOptions
): Promise<{success: boolean, result?: any, error?: string}> => {
  try {
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(
      options.contractAddress,
      options.contractABI,
      signer
    );
    
    const txOptions = options.value ? { value: ethers.utils.parseEther(options.value) } : {};
    
    const tx = await contract[options.method](
      ...(options.params || []),
      txOptions
    );
    
    if (tx.hash) {
      await tx.wait();
    }
    
    return {
      success: true,
      result: tx
    };
  } catch (error: any) {
    console.error("Contract interaction error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
