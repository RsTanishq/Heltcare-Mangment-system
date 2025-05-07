import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Configure IPFS - using the public Infura IPFS gateway
const projectId = 'YOUR_INFURA_IPFS_PROJECT_ID';  // This would ideally come from environment variables
const projectSecret = 'YOUR_INFURA_IPFS_PROJECT_SECRET';
const auth = projectId && projectSecret ? 
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64') : '';

// Create clients based on whether we have authentication or not
const getIpfsClient = () => {
  const baseConfig = {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  };
  
  // Return authenticated client if credentials are provided
  if (projectId && projectSecret && auth) {
    return create({
      ...baseConfig,
      headers: {
        authorization: auth
      }
    });
  }
  
  // Otherwise return public client
  return create(baseConfig);
};

/**
 * Uploads a file to IPFS
 * @param file The file to upload
 * @returns Object containing success status, IPFS hash (CID), and URL
 */
export const uploadToIPFS = async (file: File): Promise<{
  success: boolean;
  hash?: string;
  url?: string;
  error?: string;
}> => {
  try {
    const client = getIpfsClient();
    
    // Add file to IPFS
    const added = await client.add(
      file,
      {
        progress: (prog) => console.log(`Upload progress: ${prog}`)
      }
    );
    
    // Generate the IPFS URL
    const url = `https://ipfs.io/ipfs/${added.path}`;
    
    return {
      success: true,
      hash: added.path,
      url
    };
  } catch (error: any) {
    console.error("IPFS upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload to IPFS"
    };
  }
};

/**
 * Gets content from IPFS by CID
 * @param cid The IPFS content identifier
 * @returns The content from IPFS
 */
export const getFromIPFS = async (cid: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const client = getIpfsClient();
    
    const stream = client.cat(cid);
    let data = [];
    
    for await (const chunk of stream) {
      data.push(chunk);
    }
    
    // Combine the chunks into a single Uint8Array
    const content = new Uint8Array(data.reduce((acc: number[], val) => [...acc, ...val], []));
    
    return {
      success: true,
      data: content
    };
  } catch (error: any) {
    console.error("IPFS retrieval error:", error);
    return {
      success: false,
      error: error.message || "Failed to retrieve from IPFS"
    };
  }
};

/**
 * Convert IPFS CID to HTTP URL
 * @param cid IPFS content identifier
 * @returns HTTP URL for the IPFS content
 */
export const ipfsToHttpUrl = (cid: string): string => {
  if (!cid) return '';
  // Using Infura gateway as an alternative to ipfs.io which might be blocked by some ad-blockers
  return `https://ipfs.infura.io/ipfs/${cid}`;
};
