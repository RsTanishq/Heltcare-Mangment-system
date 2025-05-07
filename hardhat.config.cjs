require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
    // Remove or comment out the sepolia configuration if you're not using it
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    //   accounts: [process.env.PRIVATE_KEY]
    // }
  }
}; 