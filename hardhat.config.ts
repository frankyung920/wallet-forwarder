import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'solidity-docgen';
import '@openzeppelin/hardhat-upgrades';
import "hardhat-gas-reporter";
import 'solidity-coverage'

const config: HardhatUserConfig = {
  docgen: {
    
  },
  gasReporter: {

  },
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/3ffcb64b86b140cabc28cedfc1f7810b",
      chainId: 5,
      accounts:["74030207e969c37a310b7804eda6997fe5802ba7b9826c315bd374d3fb8b84aa"],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: ["74030207e969c37a310b7804eda6997fe5802ba7b9826c315bd374d3fb8b84aa"],
    }
  },
  solidity: { 
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: "PY97U887A8VZ73TZ5DVHMQES4QRIWX8MJW",
  },
};

export default config;
