import { ethers } from 'ethers';
import HealthcareABI from '../artifacts/contracts/Medical.sol/Healthcare.json';

export const initializeWeb3 = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const contract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS!,
    HealthcareABI.abi,
    signer
  );

  return { provider, signer, contract };
}; 