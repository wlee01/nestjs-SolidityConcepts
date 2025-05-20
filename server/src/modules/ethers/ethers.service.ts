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
    return this.contract.owner();
  }

  async fixedValue() {
    const value = await this.contract.FIXED_VALUE();
    return Number(value);
  }

  async value() {
    const value = await this.contract.value();
    return Number(value);
  }

  async checkValue(value: number) {
    return this.contract.checkValue(value);
  }

  async sumUpTo(value: number) {
    const result = await this.contract.sumUpTo(value);
    return Number(result);
  }

  async updateValue(value: number) {
    const tx = await this.contract.updateValue(value);
    const receipt = await tx.wait();

    let oldValue = 0;
    let newValue = 0;

    for (const log of receipt.logs) {
      try {
        const parsedLog = this.contract.interface.parseLog(log);
        if (parsedLog?.name === "ValueChanged") {
          oldValue = Number(parsedLog.args.oldValue);
          newValue = Number(parsedLog.args.newValue);
          break;
        }
      } catch (e) {
        // Ignore unrecognized logs
      }
    }

    return { oldValue, newValue };
  }

  async ownerFunction() {
    return this.contract.ownerFunction();
  }

  async sendEther(address: string, value: number) {
    const tx = await this.signer.sendTransaction({
      to: address,
      value: parseEther(value.toString())
    });
    return tx.wait();
  }

  async getContractBalance() {
    const balance = await this.provider.getBalance(this.contract.target);
    return formatEther(balance);
  }

  async deposit(value: number) {
    const tx = await this.signer.sendTransaction({
      to: this.contract.target,
      value: parseEther(value.toString())
    });
    return tx.wait();
  }

  async withDraw() {
    const tx = await this.contract.withdraw();
    return tx.wait();
  }
}