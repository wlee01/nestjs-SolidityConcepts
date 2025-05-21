import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ethers,
  zeroPadValue,
  encodeBytes32String,
  isBytesLike,
  toUtf8Bytes,
  parseEther,
  LogDescription,
  formatEther,
} from 'ethers';
import { abi, address } from '../../../abis/SolidityConcepts.json';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey!, this.provider);
    this.contract = new ethers.Contract(address, abi, this.signer);
  }

  zeroPadValue32(data: string) {
    return zeroPadValue(data, 32);
  }

  encodeBytes32String(data: string) {
    return encodeBytes32String(data);
  }

  isBytesLike(data: string) {
    return isBytesLike(data);
  }

  toUtf8Bytes(data: string) {
    return toUtf8Bytes(data);
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  // 위 코드는 지우지 마세요.
  async owner() {
    return await this.contract.owner();
  }

  async fixedValue() {
    return await this.contract.FIXED_VALUE();
  }

  async value() {
    return await this.contract.value();
  }

  async checkValue(value: number) {
    return await this.contract.checkValue(value);
  }

  async sumUpTo(value: number) {
    return await this.contract.sumUpTo(value);
  }

  async updateValue(value: number) {
    const result = {
      oldValue: 0,
      newValue: 0,
    };

    const tx = await this.contract.updateValue(value);
    const receipt = await tx.wait();

    for (const log of receipt.logs) {
      const logDescription = this.contract.interface.parseLog(
        log
      ) as LogDescription;

      if (logDescription.fragment.name === 'ValueChanged') {
        const oldValue = logDescription.args[0];
        const newValue = logDescription.args[1];
        result.oldValue = oldValue;
        result.newValue = newValue;
      }
    }
    return result;
  }

  async ownerFunction() {
    return await this.contract.ownerFunction();
  }

  async sendEther(address: string, value: number) {
    const tx = await this.contract.sendEther(address, {
      value: this.parseEther(value.toString())
    });
    const receipt = await tx.wait();

    return receipt;
  }

  async getContractBalance() {
    const lawBalance = await this.contract.getContractBalance();
    return this.formatEther(lawBalance);

  }

  async deposit(value: number) {
    const tx = await this.signer.sendTransaction({
      to: this.contract.target,
      value: this.parseEther(value.toString())
    });
    const receipt = await tx.wait();
    return receipt;
  }

  async withDraw() {
    const tx = await this.contract.withDraw();
    const receipt = await tx.wait();
    return receipt;
  }
}