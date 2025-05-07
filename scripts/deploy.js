import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // Deploy AccessControl contract first
  const AccessControl = await ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.deployed();
  console.log("AccessControl deployed to:", accessControl.address);

  // Deploy PatientConsent contract
  const PatientConsent = await ethers.getContractFactory("PatientConsent");
  const patientConsent = await PatientConsent.deploy(accessControl.address);
  await patientConsent.deployed();
  console.log("PatientConsent deployed to:", patientConsent.address);

  // Deploy HealthcareProvider contract
  const HealthcareProvider = await ethers.getContractFactory("HealthcareProvider");
  const healthcareProvider = await HealthcareProvider.deploy(accessControl.address);
  await healthcareProvider.deployed();
  console.log("HealthcareProvider deployed to:", healthcareProvider.address);

  // Deploy HealthcareRecord contract
  const HealthcareRecord = await ethers.getContractFactory("HealthcareRecord");
  const healthcareRecord = await HealthcareRecord.deploy(
    accessControl.address,
    patientConsent.address,
    healthcareProvider.address
  );
  await healthcareRecord.deployed();
  console.log("HealthcareRecord deployed to:", healthcareRecord.address);

  // Initialize roles and permissions
  const [deployer] = await ethers.getSigners();
  
  // Grant admin role to deployer
  await accessControl.grantRole(await accessControl.ADMIN(), deployer.address);
  console.log("Admin role granted to deployer");

  // Grant doctor role to deployer for testing
  await accessControl.grantRole(await accessControl.DOCTOR(), deployer.address);
  console.log("Doctor role granted to deployer");

  // Register deployer as a provider for testing
  await healthcareProvider.registerProvider(
    "Test Doctor",
    "doctor",
    "TEST123",
    "General Medicine"
  );
  console.log("Deployer registered as provider");

  // Verify the provider
  await healthcareProvider.verifyProvider(deployer.address);
  console.log("Deployer verified as provider");

  const Healthcare = await ethers.getContractFactory("Healthcare");
  console.log("Deploying Healthcare contract...");
  
  const healthcare = await Healthcare.deploy();
  await healthcare.deployed();

  console.log("Healthcare contract deployed to:", healthcare.address);
  
  // Save the contract address to a file
  const envContent = `VITE_CONTRACT_ADDRESS=${healthcare.address}`;
  fs.writeFileSync('.env.local', envContent);
  console.log("Contract address saved to .env.local");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 