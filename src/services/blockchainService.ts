import { ethers } from "ethers";
import axios from "axios";
import HealthcareABI from "../contracts/Healthcare.json";

export class BlockchainService {
  private provider: ethers.BrowserProvider;
  private contract: ethers.Contract;
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private REGISTRATION_FEE = ethers.parseEther("0.00025"); // Define fee directly

  // Static flag to track if we've already logged environment info
  private static hasLoggedEnvInfo = false;

  constructor() {
    // Check if window.ethereum exists
    if (typeof window.ethereum === "undefined") {
      throw new Error("Please install MetaMask to use this application");
    }

    // Initialize provider and contract
    this.provider = new ethers.BrowserProvider(window.ethereum);

    // Use Vite's environment variables
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    if (!contractAddress) {
      throw new Error("Contract address not found in environment variables");
    }

    this.contract = new ethers.Contract(
      contractAddress,
      HealthcareABI.abi,
      this.provider
    ) as unknown as ethers.Contract & {
      registerUser: (
        name: string,
        role: string,
        ipfsHash: string,
        options?: { value: bigint }
      ) => Promise<ethers.ContractTransactionResponse>;
      getUserDetails: (address: string) => Promise<any>;
      getAllDoctors: () => Promise<string[]>;
    };

    // Use Vite's environment variables for Pinata
    this.pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    this.pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY;

    // Only log environment variables once to avoid console spam
    if (!BlockchainService.hasLoggedEnvInfo) {
      console.log("Environment variables loaded:");
      console.log("- Contract Address available:", !!contractAddress);
      console.log("- Pinata API Key available:", !!this.pinataApiKey);
      console.log("- Pinata Secret Key available:", !!this.pinataSecretKey);

      if (!this.pinataApiKey || !this.pinataSecretKey) {
        console.warn(
          "WARNING: Pinata API keys are missing or invalid. File uploads will fail."
        );
      }

      // Set flag to true so we don't log again
      BlockchainService.hasLoggedEnvInfo = true;
    }
  }

  async connectWallet() {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }

  private async getSignedContract() {
    const signer = await this.provider.getSigner();
    return this.contract.connect(signer);
  }

  async registerUser(name: string, role: string, ipfsHash: string) {
    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      // Always include the registration fee
      const tx = await contractWithSigner.registerUser(name, role, ipfsHash, {
        value: this.REGISTRATION_FEE,
      });

      await tx.wait();
      console.log("Registration transaction successful:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async uploadToPinata(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const jsonFile = new Blob([jsonString], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", jsonFile);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretKey,
          },
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
  }

  async uploadProfileImageToPinata(file: File): Promise<string> {
    try {
      // Create a more detailed FormData
      const formData = new FormData();
      formData.append("file", file);

      // Add metadata
      const metadata = JSON.stringify({
        name: `profile-${Date.now()}`,
        keyvalues: {
          type: "profile-image",
        },
      });
      formData.append("pinataMetadata", metadata);

      // Add options
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity, // Required for large files
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretKey,
          },
        }
      );

      if (response.data.IpfsHash) {
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      } else {
        throw new Error("No IPFS hash received from Pinata");
      }
    } catch (error: any) {
      console.error(
        "Error uploading profile image to Pinata:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async uploadDocumentToPinata(
    file: File,
    metadata?: {
      patientId?: string;
      doctorId?: string;
      documentType?: string;
    }
  ): Promise<{
    success: boolean;
    hash?: string;
    url?: string;
    name?: string;
    size?: string;
    format?: string;
    error?: string;
  }> {
    try {
      // Log file details only (no sensitive info)
      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Add metadata
      const metadataObj = {
        name: `medical-doc-${Date.now()}`,
        keyvalues: {
          type: "medical-document",
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          ...metadata,
        },
      };
      formData.append("pinataMetadata", JSON.stringify(metadataObj));

      // Add options
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      // Make sure we're using the correct API keys from environment variables
      const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
      const pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY;

      if (!pinataApiKey || !pinataSecretKey) {
        throw new Error(
          "Pinata API keys are missing from environment variables"
        );
      }

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity, // Required for large files
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretKey,
          },
        }
      );

      if (response.data.IpfsHash) {
        // Format file size for display
        const formatFileSize = (bytes: number): string => {
          if (bytes < 1024) return bytes + " B";
          else if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + " KB";
          else if (bytes < 1024 * 1024 * 1024)
            return (bytes / (1024 * 1024)).toFixed(1) + " MB";
          else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
        };

        // Determine document format based on file type
        const getDocumentFormat = (
          fileType: string
        ): "pdf" | "image" | "spreadsheet" | "document" => {
          if (fileType.includes("pdf")) return "pdf";
          else if (fileType.includes("image")) return "image";
          else if (
            fileType.includes("excel") ||
            fileType.includes("spreadsheet") ||
            fileType.includes("csv")
          )
            return "spreadsheet";
          else return "document";
        };

        const result = {
          success: true,
          hash: response.data.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
          name: file.name,
          size: formatFileSize(file.size),
          format: getDocumentFormat(file.type),
        };

        console.log("File uploaded successfully to IPFS");
        return result;
      } else {
        throw new Error("No IPFS hash received from Pinata");
      }
    } catch (error: any) {
      console.error(
        "Error uploading document to Pinata:",
        error.response?.data || error.message
      );

      // More detailed error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);
      }

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to upload document",
      };
    }
  }

  async registerPatient(patientData: {
    fullName: string;
    email: string;
    walletAddress: string;
    phoneNumber: string;
    gender?: "Male" | "Female" | "Other";
    age?: string;
    profileImage?: File;
  }) {
    try {
      // Upload profile image if exists
      let profileImageUrl = "";
      if (patientData.profileImage) {
        profileImageUrl = await this.uploadProfileImageToPinata(
          patientData.profileImage
        );
      }

      // Upload patient data to IPFS
      const ipfsHash = await this.uploadToPinata({
        fullName: patientData.fullName,
        email: patientData.email,
        phoneNumber: patientData.phoneNumber,
        gender: patientData.gender || "Male", // Include gender
        age: patientData.age || "", // Include age
        profileImage: profileImageUrl,
        createdAt: new Date().toISOString(),
      });

      // Get contract with signer
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      // Register patient on blockchain with fee
      const tx = await contractWithSigner.registerUser(
        patientData.fullName,
        "patient",
        ipfsHash,
        { value: this.REGISTRATION_FEE }
      );

      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error registering patient:", error);
      throw error;
    }
  }

  async registerDoctor(doctorData: {
    fullName: string;
    email: string;
    walletAddress: string;
    specialization: string;
    license: string;
    phoneNumber: string;
    gender?: "Male" | "Female" | "Other";
    yearsOfExperience: string;
    hospitalAffiliation: string;
    workAddress: string;
    profileImage?: File;
  }) {
    try {
      // Upload profile image if exists
      let profileImageUrl = "";
      if (doctorData.profileImage) {
        profileImageUrl = await this.uploadProfileImageToPinata(
          doctorData.profileImage
        );
      }

      // Upload doctor data to IPFS
      const ipfsHash = await this.uploadToPinata({
        fullName: doctorData.fullName,
        email: doctorData.email,
        specialization: doctorData.specialization,
        license: doctorData.license,
        phoneNumber: doctorData.phoneNumber,
        gender: doctorData.gender || "Male", // Include gender
        yearsOfExperience: doctorData.yearsOfExperience,
        hospitalAffiliation: doctorData.hospitalAffiliation,
        workAddress: doctorData.workAddress,
        profileImage: profileImageUrl,
        createdAt: new Date().toISOString(),
      });

      // Get contract with signer
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      // Register doctor on blockchain with fee
      const tx = await contractWithSigner.registerUser(
        doctorData.fullName,
        "doctor",
        ipfsHash,
        { value: this.REGISTRATION_FEE }
      );

      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error registering doctor:", error);
      throw error;
    }
  }

  async verifyContract() {
    try {
      const signer = await this.provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected wallet address:", address);

      // Try to call a view function from the contract
      const isRegistered = await this.contract.users(address);
      console.log("User registration status:", isRegistered);

      return {
        success: true,
        walletAddress: address,
        contractAddress: this.contract.target,
      };
    } catch (error) {
      console.error("Contract verification error:", error);
      throw error;
    }
  }

  async getUserData(address: string): Promise<any> {
    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      // Get user details from blockchain
      const userDetails = await contractWithSigner.getUserDetails(address);

      // If user exists and has IPFS hash
      if (userDetails && userDetails.ipfsHash) {
        // Convert IPFS hash to HTTP URL
        const ipfsUrl = userDetails.ipfsHash.replace(
          "ipfs://",
          "https://gateway.pinata.cloud/ipfs/"
        );

        // Fetch user data from IPFS
        const response = await axios.get(ipfsUrl);
        return {
          ...response.data,
          role: userDetails.role,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  // Add a method to get the registration fee amount (for display purposes)
  getRegistrationFeeInEth(): string {
    return "0.00025";
  }

  async verifyUserRegistration(address: string): Promise<{
    isRegistered: boolean;
    details?: any;
    error?: string;
  }> {
    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      // Get user details from blockchain
      const userDetails = await contractWithSigner.getUserDetails(address);
      console.log("User details from blockchain:", userDetails);

      return {
        isRegistered: userDetails.isRegistered,
        details: userDetails,
      };
    } catch (error: any) {
      console.error("Error verifying user registration:", error);
      return {
        isRegistered: false,
        error: error.message,
      };
    }
  }

  async disconnectWallet() {
    try {
      // Clear all wallet-related data
      localStorage.removeItem("walletState");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("rememberedCredentials");
      localStorage.removeItem("doctorActiveTab");
      localStorage.removeItem("doctorMedications");
      localStorage.removeItem("doctorPatients");

      // Clear any IPFS cache that might be stored
      const ipfsCacheKeys = Object.keys(localStorage).filter(
        (key) => key.startsWith("ipfs-") || key.includes("ipfs")
      );

      ipfsCacheKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Reset provider state
      this.provider = new ethers.BrowserProvider(window.ethereum);

      // Force page reload to clear any in-memory state
      if (typeof window !== "undefined") {
        window.location.href = "/"; // Redirect to root which is the login page
      }

      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw error;
    }
  }

  // Fetch all doctors from the smart contract
  async getAllDoctors(): Promise<any[]> {
    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      // Get all doctor addresses from the contract
      const doctorAddresses: string[] =
        await contractWithSigner.getAllDoctors();
      const doctors: any[] = [];

      for (const address of doctorAddresses) {
        const userDetails = await contractWithSigner.getUserDetails(address);
        if (
          userDetails &&
          userDetails.isRegistered &&
          userDetails.role === "doctor"
        ) {
          let ipfsData = {};
          if (userDetails.ipfsHash) {
            const ipfsUrl = userDetails.ipfsHash.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            );
            try {
              const response = await axios.get(ipfsUrl);
              ipfsData = response.data;
            } catch (e) {
              // Ignore IPFS fetch errors for now
            }
          }
          doctors.push({
            address,
            ...userDetails,
            ...ipfsData,
          });
        }
      }
      return doctors;
    } catch (error) {
      console.error("Error fetching all doctors:", error);
      throw error;
    }
  }
}
