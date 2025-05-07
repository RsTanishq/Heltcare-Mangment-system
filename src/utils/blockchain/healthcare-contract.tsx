export const HEALTHCARE_RECORD_CONTRACT = {
  abi: [
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
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        }
      ],
      "name": "AccessGranted",
      "type": "event"
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
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        }
      ],
      "name": "AccessRevoked",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "recordHash",
          "type": "string"
        }
      ],
      "name": "addRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        }
      ],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        }
      ],
      "name": "getRecord",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "recordId",
          "type": "string"
        }
      ],
      "name": "checkAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  bytecode: "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061082a806100606000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633580a0c01461005c5780633e49bed0146100785780637a639f6e14610094578063895122ad146100b0578063c4b9696e146100cc575b600080fd5b61007660048036038101906100719190610579565b6100e8565b005b610092600480360381019061008d9190610602565b610236565b005b6100ae60048036038101906100a99190610602565b6102ce565b005b6100ca60048036038101906100c5919061064f565b610366565b005b6100e660048036038101906100e19190610602565b61047e565b005b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008381526020019081526020016000208190555080600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208290806001815401808255809150506001900390600052602060002001600090919091909150908051906020019061019d9291906104e7565b507f3d5ff596ecefb66205e6181a15ba15162bf0b23966b13c5bdedc92c1c09b72353382604051610230929190610718565b60405180910390a1505050565b336003600086815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550807f3d5ff596ecefb66205e6181a15ba15162bf0b23966b13c5bdedc92c1c09b72353384604051610439929190610718565b60405180910390a25050565b6003600084815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b8280546104f390610830565b90600052602060002090601f0160209004810192826105155760008555610562565b82601f1061052e57805160ff191683800117855561055c565b8280016001018555821561055c579182015b8281111561055b578251825591602001919060010190610540565b5b50905061056991906105ed565b5090565b60008135905061057381610913565b92915050565b60008060408385031215610590576105af6108ae565b5b600061059e85828601610564565b92505060206105af85828601610870565b9150509250929050565b60008135905061059e81610913565b600080604083850312156106195761061b6108ae565b5b600061062785828601610564565b925050602061063885828601610564565b9150509250929050565b6000604082019050610666576106686108ae565b5b600061067485828601610564565b92505060206106858582860161058d565b9150509250929050565b60006106998261089a565b6106a381856108a5565b93506106b38185602086016108a8565b6106bc816108b3565b840191505092915050565b60006106d2826108a5565b6106dc81856108a5565b93506106ec8185602086016108a8565b6106f5816108b3565b840191505092915050565b610709816108a5565b82525050565b61071281610901565b82525050565b600060408201905061072d600083018561068e565b81810360208301526107408184016106b0565b90509392505050565b600060208201905061075e600083018461068e565b92915050565b60006020820190506107796084836106b0565b92915050565b600060208201905061079360008301846106c7565b92915050565b600060208201905061079d60008301846106c7565b92915050565b60006020820190506107b760008301846106c7565b92915050565b60006020820190506107d160008301846106c7565b92915050565b600060208201905061084560008301846106c7565b92915050565b6000602082019050610859600083018461070e565b92915050565b6000819050919050565b61087981610866565b811461088457600080fd5b50565b60006108b282610866565b9050919050565b6108c3816108a7565b81146108ce57600080fd5b50565b6000602082840312156108e6576108e76108ae565b5b60006108f4848285016108b8565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b60008160e01c9050919050565b6000019050919050565b61094081610866565b81146109f557600080fd5b5056fea26469706673582212208e49225bad7bdb0aa86e520a493a8a432f0d098fb6f9fdc01372282b99996f5b64736f6c63430008090033"
};

export const HEALTHCARE_RECORD_CONTRACT_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract HealthcareRecord {
    address public owner;
    
    // Mapping from patient address => record ID => record hash
    mapping(address => mapping(string => string)) private records;
    
    // List of records for each patient
    mapping(address => string[]) private patientRecords;
    
    // Mapping record ID => provider address => access permission
    mapping(string => mapping(address => bool)) private accessPermissions;
    
    // Events
    event RecordAdded(address indexed patient, string recordId);
    event AccessGranted(address indexed patient, address indexed provider, string recordId);
    event AccessRevoked(address indexed patient, address indexed provider, string recordId);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Add a new medical record
    function addRecord(string memory recordId, string memory recordHash) public {
        records[msg.sender][recordId] = recordHash;
        patientRecords[msg.sender].push(recordId);
        
        // Grant access to the patient by default
        accessPermissions[recordId][msg.sender] = true;
        
        emit RecordAdded(msg.sender, recordId);
    }
    
    // Grant access to a provider
    function grantAccess(address provider, string memory recordId) public {
        accessPermissions[recordId][provider] = true;
        emit AccessGranted(msg.sender, provider, recordId);
    }
    
    // Revoke access from a provider
    function revokeAccess(address provider, string memory recordId) public {
        accessPermissions[recordId][provider] = false;
        emit AccessRevoked(msg.sender, provider, recordId);
    }
    
    // Get record hash (only if has access)
    function getRecord(string memory recordId) public view returns (string memory) {
        require(accessPermissions[recordId][msg.sender], "No access to this record");
        return records[msg.sender][recordId];
    }
    
    // Check if a provider has access to a record
    function checkAccess(address provider, string memory recordId) public view returns (bool) {
        return accessPermissions[recordId][provider];
    }
}
`;
