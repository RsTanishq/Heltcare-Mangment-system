
export { useEthereumWallet } from './wallet';
export { createTransaction, verifyTransaction } from './transactions';
export { 
  deploySmartContract, 
  interactWithContract,
  type DeploymentOptions,
  type ContractInteractionOptions
} from './contracts';
export { 
  HEALTHCARE_RECORD_CONTRACT,
  HEALTHCARE_RECORD_CONTRACT_SOURCE 
} from './healthcare-contract';
export {
  connectToGanache,
  deployContract,
  getContractArtifact,
  TRUFFLE_CONFIG
} from './truffle-config';
