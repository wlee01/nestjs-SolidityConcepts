import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/7f561ffb5e6b4b2fa98b24cd661e023f', // Infura 또는 Alchemy 등 RPC URL
      accounts: [privateKey!], // 개인키 (0x로 시작하는 64자리 16진수 문자열)
    },
  },
};

export default config;


