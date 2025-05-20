import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // 컨트랙트 팩토리 불러오기
  const ContractFactory = await ethers.getContractFactory('SolidityConcepts');

  // 배포
  const contract = await ContractFactory.deploy();

  // 대기: deployed() 대신 waitForDeployment()
  await contract.waitForDeployment();

  console.log(`SolidityConcepts contract deployed at: ${contract.target}`);

  // ABI 파일 생성
  await makeAbi('SolidityConcepts', contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
