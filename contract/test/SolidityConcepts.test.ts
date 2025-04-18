import { expect } from 'chai';
import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

describe('SolidityConcepts', function () {
  let contract: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory('SolidityConcepts');
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe('라이선스 및 Solidity 버전 검사', function () {
    it('컨트랙트에서 SPDX 주석으로 라이선스가 있어야 합니다.', async function () {
      const contractPath = path.join(
        __dirname,
        '../contracts/SolidityConcepts.sol'
      );
      const sourceCode = fs.readFileSync(contractPath, 'utf8');
      expect(sourceCode.match(/\/\/ SPDX-License-Identifier:/)).to.not.be.null;
    });

    it('컨트랙트에서 Solidity 버전이 0.8.0 이상, 0.9.0 미만이어야 합니다.', async function () {
      const contractPath = path.join(
        __dirname,
        '../contracts/SolidityConcepts.sol'
      );
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      const versionMatch = sourceCode.match(/pragma solidity\s+([^;]+);/);
      expect(versionMatch).to.not.be.null;

      const solidityVersion = versionMatch![1].trim();
      const validVersions = ['>=0.8.0 <0.9.0', '^0.8.0'];

      expect(validVersions.includes(solidityVersion)).to.be.true;
    });
  });

  describe('상태 변수 검사', function () {
    it('uint256 타입의 public 상수(constant) FIXED_VALUE 변수의 초기값은 100이어야 합니다.', async function () {
      expect(await contract.FIXED_VALUE()).to.equal(100);
    });

    it('address 타입의 public 불변(immutable) owner 변수가 배포자의 주소여야 합니다.', async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it('uint256 타입의 public 일반 상태변수 value 의 초기값은 50이어야 합니다.', async function () {
      expect(await contract.value()).to.equal(50);
    });
  });

  describe('조건문 검사(checkValue)', function () {
    it('함수 checkValue 호출 시 인자(uint256)를 받아 string 타입이 리턴되어야 합니다.', async function () {
      expect(await contract.checkValue(101)).to.equal(
        'Value is greater than 100'
      );
    });

    it('함수 checkValue 호출 시 인자값이 100보다 큰 경우 "Value is greater than 100"이 리턴되어야 합니다.', async function () {
      expect(await contract.checkValue(101)).to.equal(
        'Value is greater than 100'
      );
    });

    it('함수 checkValue 호출 시 인자값이 100인 경우 "Value is exactly 100"이 리턴되어야 합니다.', async function () {
      expect(await contract.checkValue(100)).to.equal('Value is exactly 100');
    });

    it('함수 checkValue 호출 시 인자값이 100보다 작은 경우 "Value is less than 100"이 리턴되어야 합니다.', async function () {
      expect(await contract.checkValue(99)).to.equal('Value is less than 100');
    });
  });

  describe('반복문 검사', function () {
    it('함수 sumUpTo 호출 시 인자(uint256)를 받아 uint256 타입이 리턴되어야 합니다.', async function () {
      expect(await contract.sumUpTo(5)).to.equal(15);
    });

    it('함수 sumUpTo 호출 시 인자(uint256)를 받아 uint256 타입이 리턴되어야 합니다.', async function () {
      expect(await contract.sumUpTo(5)).to.equal(15);
    });

    it('sumUpTo 함수는 for 문을 사용해야 합니다.', async function () {
      const contractPath = path.join(
        __dirname,
        '../contracts/SolidityConcepts.sol'
      );
      const sourceCode = fs.readFileSync(contractPath, 'utf8');
      expect(sourceCode.match(/\bfor\s*\(/)).to.not.be.null;
    });

    it('sumUpTo 함수는 1부터 인자(uint256)까지 모든 정수를 더한 값을 반환해야 합니다.', async function () {
      expect(await contract.sumUpTo(5)).to.equal(15);
      expect(await contract.sumUpTo(3)).to.equal(6);
    });
  });

  describe('이벤트(event) 검사', function () {
    it('이벤트 ValueChanged는 인자 (uint256 oldValue, uint256 newValue)와 함께 발생해야 합니다.', async function () {
      const updateValue = await contract.updateValue(42);
      const receipt = await updateValue.wait();

      await expect(receipt).to.emit(contract, 'ValueChanged').withArgs(50, 42);
    });

    it('함수 updateValue 호출 시 상태변수 value에 새로운 값이 저장되고 ValueChanged 이벤트가 발생(emit)해야 합니다.', async function () {
      const oldValue = await contract.value();
      const newValue = 42;

      const tx = await contract.updateValue(newValue);

      await expect(tx)
        .to.emit(contract, 'ValueChanged')
        .withArgs(oldValue, newValue);

      expect(await contract.value()).to.equal(newValue);
    });
  });

  describe('접근 제어자(modifier) & 에러 처리(require) 검사', function () {
    it('modifier onlyOwner가 존재해야 합니다.', async function () {
      const contractPath = path.join(
        __dirname,
        '../contracts/SolidityConcepts.sol'
      );
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      expect(sourceCode.match(/\bmodifier\s+onlyOwner\s*\(\)\s*\{/)).to.not.be
        .null;
    });

    it('onlyOwner modifier가 함수 ownerFunction에 적용되어야 합니다.', async function () {
      const contractPath = path.join(
        __dirname,
        '../contracts/SolidityConcepts.sol'
      );
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      const regex =
        /\bfunction\s+ownerFunction\s*\([^)]*\)\s+(?:[\w\s]*)\bonlyOwner\b/;

      expect(sourceCode.match(regex)).to.not.be.null;
    });

    it('modifier onlyOwner는 소유자(owner)가 아닌 경우 "Not the contract owner"를 에러로 출력(require)해야 합니다.', async function () {
      await expect(
        contract.connect(otherAccount).ownerFunction()
      ).to.be.revertedWith('Not the contract owner');
    });

    it('소유자(owner)가 함수 ownerFunction을 실행시 "Hello, Owner!"를 리턴해야 합니다.', async function () {
      expect(await contract.connect(owner).ownerFunction()).to.equal(
        'Hello, Owner!'
      );
    });
  });

  describe('코인 송금 & 에러 처리(require) 검사', function () {
    it('컨트랙트에 receive() 함수가 정의되어 있어야 합니다.', async function () {
      const contractPath = path.join(
        __dirname,
        '../contracts/SolidityConcepts.sol'
      );
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      expect(sourceCode.match(/\breceive\s*\(\)\s*external\s*payable\s*\{/)).to
        .not.be.null;
    });

    it('컨트랙트는 코인을 받을 수 있어야 합니다.', async function () {
      const sendTransaction = await owner.sendTransaction({
        to: contract.target,
        value: ethers.parseEther('1.0'),
      });
      await sendTransaction.wait();

      const balance = ethers.formatEther(
        await ethers.provider.getBalance(contract.target)
      );
      expect(balance).to.equal('1.0');
    });

    it('sendEther 함수 호출 시 인자(address)로 들어오는 수신자가 이더를 정상적으로 받아야 합니다.', async function () {
      await owner.sendTransaction({
        to: contract.target,
        value: ethers.parseEther('1.0'),
      });

      const initialBalance = await ethers.provider.getBalance(
        otherAccount.address
      );

      await contract
        .connect(owner)
        .sendEther(otherAccount.address, { value: ethers.parseEther('0.5') });

      const finalBalance = await ethers.provider.getBalance(
        otherAccount.address
      );

      expect(finalBalance).to.equal(initialBalance + ethers.parseEther('0.5'));
    });

    it('sendEther 함수 호출 시 송금액(msg.value)이 0 미만일 경우 "Must send ether"를 오류로 출력(require)해야 합니다.', async function () {
      const sendTransaction = await owner.sendTransaction({
        to: contract.target,
        value: ethers.parseEther('1'),
      });
      await sendTransaction.wait();

      await expect(
        contract
          .connect(owner)
          .sendEther(otherAccount.address, { value: ethers.parseEther('0') })
      ).to.be.revertedWith('Must send ether');
    });

    it('getContractBalance 함수는 현재 컨트랙트 잔액을 반환해야 합니다.', async function () {
      await owner.sendTransaction({
        to: contract.target,
        value: ethers.parseEther('1.0'),
      });

      expect(await contract.getContractBalance()).to.equal(
        ethers.parseEther('1.0')
      );
    });

    it('withDraw 함수 호출 시 소유자(owner)가 컨트랙트의 모든 잔액을 인출해야 합니다.', async function () {
      await owner.sendTransaction({
        to: contract.target,
        value: ethers.parseEther('1.0'),
      });

      expect(await contract.getContractBalance()).to.equal(
        ethers.parseEther('1.0')
      );

      await contract.connect(owner).withDraw();

      expect(await contract.getContractBalance()).to.equal(0);
    });

    it('소유자(owner)가 아닌 계정이 withDraw를 호출하면 실패해야 합니다.(modifier)', async function () {
      await expect(
        contract.connect(otherAccount).withDraw()
      ).to.be.revertedWith('Not the contract owner');
    });
  });
});
