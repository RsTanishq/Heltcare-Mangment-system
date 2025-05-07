const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  // Get the contract factory
  const Healthcare = await hre.ethers.getContractFactory("Healthcare");
  console.log("Contract factory created...");
  
  // Deploy the contract
  const healthcare = await Healthcare.deploy();
  console.log("Contract deployed to:", await healthcare.getAddress());
  console.log("Contract successfully deployed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 