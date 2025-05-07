const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Healthcare = await hre.ethers.getContractFactory("Healthcare");
  console.log("Deploying Healthcare contract...");
  
  const healthcare = await Healthcare.deploy();
  await healthcare.waitForDeployment();

  const address = await healthcare.getAddress();
  console.log("Healthcare contract deployed to:", address);
  
  // Save the contract address to a file
  const envContent = `VITE_CONTRACT_ADDRESS=${address}`;
  fs.writeFileSync('.env.local', envContent);
  console.log("Contract address saved to .env.local");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 