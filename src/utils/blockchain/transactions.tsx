
import { ethers } from 'ethers';

export const createTransaction = async (
  provider: ethers.providers.Web3Provider,
  toAddress: string,
  amount: string
): Promise<{success: boolean, txHash?: string, error?: string}> => {
  try {
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(amount)
    });
    
    console.log("Transaction sent:", tx.hash);
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error: any) {
    console.error("Transaction error:", error);
    return {
      success: false,
      error: error.message || "Transaction failed"
    };
  }
};

export const verifyTransaction = async (
  provider: ethers.providers.Web3Provider,
  txHash: string
): Promise<{valid: boolean, data?: any, error?: string}> => {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return { valid: false, error: "Transaction not found" };
    }
    
    // Get receipt to check status
    const receipt = await provider.getTransactionReceipt(txHash);
    const isConfirmed = receipt && receipt.confirmations > 0;
    
    return {
      valid: true,
      data: {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.utils.formatEther(tx.value),
        blockNumber: tx.blockNumber ? tx.blockNumber : "Pending",
        confirmed: isConfirmed,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error("Transaction verification error:", error);
    return {
      valid: false,
      error: error.message || "Failed to verify transaction"
    };
  }
};
