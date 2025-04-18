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
    // Todo: owner의 값을 리턴합니다.
  }

  async fixedValue() {
    // Todo: FIXED_VALUE의 값을 리턴합니다.
  }

  async value() {
    // Todo: value의 값을 리턴합니다.
  }

  async checkValue(value: number) {
    // Todo: checkValue의 값을 리턴합니다.
  }

  async sumUpTo(value: number) {
    // Todo: sumUpTo의값을 리턴합니다.
  }

  async updateValue(value: number) {
    const result = {
      oldValue: 0,
      newValue: 0,
    };

    // Todo: updateValue의값을 리턴합니다.
    // ⚠️ ValueChanged 이벤트를 영수증안의 logs 에서 확인(contract.interface.parseLog(log))하여 객체를 리턴합니다.
    /*
      예시 - 리턴 객체
      {
        oldValue: 123,
        newValue: 1
      }
    */
  }

  async ownerFunction() {
    // Todo: ownerFunction의값을 리턴합니다.
  }

  async sendEther(address: string, value: number) {
    // Todo: sendEther의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)
  }

  async getContractBalance() {
    // Todo: getContractBalance의 값을 리턴합니다.
    // ⚠️ 리턴은 ether 단위로 리턴합니다.(wei => ether)
  }

  async deposit(value: number) {
    // Todo: Contract에 코인을 전송합니다.
    // ⚠️ tx 확정 후 영수증을 리턴합니다.(wait)
  }

  async withDraw() {
    // Todo: withDraw의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)
  }
}
