// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Healthcare {
    struct User {
        string name;
        string role; // "patient" or "doctor"
        string ipfsHash; // For additional user data stored on IPFS
        bool isRegistered;
    }

    struct MedicalRecord {
        string ipfsHash;
        address patient;
        address doctor;
        uint256 timestamp;
    }

    // Registration fee in ETH (0.00025 ETH)
    uint256 public constant REGISTRATION_FEE = 250000000000000; // in wei (0.00025 ETH)
    address public owner;
    
    mapping(address => User) public users;
    mapping(address => MedicalRecord[]) public patientRecords;

    event UserRegistered(address indexed userAddress, string role);
    event MedicalRecordAdded(address indexed patient, address indexed doctor, string ipfsHash);
    event RegistrationFeePaid(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function registerUser(string memory _name, string memory _role, string memory _ipfsHash) public payable {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("patient")) ||
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("doctor")),
            "Invalid role"
        );
        require(msg.value == REGISTRATION_FEE, "Incorrect registration fee");

        users[msg.sender] = User(_name, _role, _ipfsHash, true);
        
        // Transfer the registration fee to the contract owner
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Failed to send registration fee");

        emit UserRegistered(msg.sender, _role);
        emit RegistrationFeePaid(msg.sender, msg.value);
    }

    function addMedicalRecord(address _patient, string memory _ipfsHash) public {
        require(users[msg.sender].isRegistered, "Doctor not registered");
        require(users[_patient].isRegistered, "Patient not registered");
        require(
            keccak256(abi.encodePacked(users[msg.sender].role)) == keccak256(abi.encodePacked("doctor")),
            "Only doctors can add records"
        );

        MedicalRecord memory newRecord = MedicalRecord({
            ipfsHash: _ipfsHash,
            patient: _patient,
            doctor: msg.sender,
            timestamp: block.timestamp
        });

        patientRecords[_patient].push(newRecord);
        emit MedicalRecordAdded(_patient, msg.sender, _ipfsHash);
    }

    function getUserDetails(address _userAddress) public view returns (User memory) {
        require(users[_userAddress].isRegistered, "User not found");
        return users[_userAddress];
    }

    function getPatientRecords(address _patient) public view returns (MedicalRecord[] memory) {
        require(
            msg.sender == _patient || 
            keccak256(abi.encodePacked(users[msg.sender].role)) == keccak256(abi.encodePacked("doctor")),
            "Unauthorized"
        );
        return patientRecords[_patient];
    }

    // View function to get registration fee
    function getRegistrationFee() public pure returns (uint256) {
        return REGISTRATION_FEE;
    }
} 