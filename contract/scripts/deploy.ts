import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const Contract = await ethers.getContractFactory('SolidityConcepts');
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  console.log('SolidityConcepts contract deployed at: ${contract.target}');
  await makeAbi('SolidityConcepts', contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
