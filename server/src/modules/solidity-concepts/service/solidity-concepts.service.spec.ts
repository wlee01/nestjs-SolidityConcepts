import { Test, TestingModule } from '@nestjs/testing';
import { SolidityConceptsService } from './solidity-concepts.service';
import { EthersService } from '../../ethers/ethers.service';
import { exceptions } from '../../../common/exceptions/exception.config';

const mockEthersService = {
  owner: jest.fn(),
  fixedValue: jest.fn(),
  value: jest.fn(),
  checkValue: jest.fn(),
  sumUpTo: jest.fn(),
  updateValue: jest.fn(),
  ownerFunction: jest.fn(),
  sendEther: jest.fn(),
  getContractBalance: jest.fn(),
  deposit: jest.fn(),
  withDraw: jest.fn(),
  parseEther: jest.fn((value: string) => BigInt(Number(value) * 1e18)),
  formatEther: jest.fn((value: bigint) => (Number(value) / 1e18).toString()),
};

describe('SolidityConceptsService', () => {
  let service: SolidityConceptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolidityConceptsService,
        { provide: EthersService, useValue: mockEthersService },
      ],
    }).compile();

    service = module.get<SolidityConceptsService>(SolidityConceptsService);
  });

  it('getOwner()는 소유자 주소를 반환해야 합니다.', async () => {
    mockEthersService.owner.mockResolvedValue('0xOwner');
    expect(await service.getOwner()).toBe('0xOwner');
  });

  it('fixedValue()는 고정 값을 반환해야 합니다.', async () => {
    mockEthersService.fixedValue.mockResolvedValue(100);
    expect(await service.fixedValue()).toBe(100);
  });

  it('getValue()는 현재 값을 반환해야 합니다.', async () => {
    mockEthersService.value.mockResolvedValue(50);
    expect(await service.getValue()).toBe(50);
  });

  it('checkValue()는 비교 결과를 반환해야 합니다.', async () => {
    mockEthersService.checkValue.mockResolvedValue('greater');
    expect(await service.checkValue(101)).toBe('greater');
  });

  it('sumValue()는 누적 합계를 반환해야 합니다.', async () => {
    mockEthersService.sumUpTo.mockResolvedValue(5050);
    expect(await service.sumValue(100)).toBe(5050);
  });

  it('updateValue()는 이벤트 값을 문자열로 반환해야 합니다.', async () => {
    mockEthersService.updateValue.mockResolvedValue({
      oldValue: 10n,
      newValue: 20n,
    });
    const result = await service.updateValue(20);
    expect(result).toEqual({ oldValue: '10', newValue: '20' });
  });

  it('ownerFunction()은 소유자 전용 메시지를 반환해야 합니다.', async () => {
    mockEthersService.ownerFunction.mockResolvedValue('Hello, Owner!');
    expect(await service.ownerFunction()).toBe('Hello, Owner!');
  });

  it('ownerFunction()은 권한 없을 때 NOT_THE_CONTRACT_OWNER 예외를 던져야 합니다.', async () => {
    mockEthersService.ownerFunction.mockRejectedValue({
      reason: 'Not the contract owner',
    });
    await expect(service.ownerFunction()).rejects.toEqual(
      exceptions.NOT_THE_CONTRACT_OWNER
    );
  });

  it('sendEther()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    mockEthersService.sendEther.mockResolvedValue('receipt');
    expect(await service.sendEther('0xabc', 1)).toBe('receipt');
  });

  it('getContractBalance()는 이더 단위의 잔액을 반환해야 합니다.', async () => {
    mockEthersService.getContractBalance.mockResolvedValue('1.0');
    expect(await service.getContractBalance()).toBe('1.0');
  });

  it('deposit()은 트랜잭션 영수증을 반환해야 합니다.', async () => {
    mockEthersService.deposit.mockResolvedValue('receipt');
    expect(await service.deposit(1)).toBe('receipt');
  });

  it('withDraw()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    mockEthersService.withDraw.mockResolvedValue('receipt');
    expect(await service.withDraw()).toBe('receipt');
  });

  it('withDraw()는 권한 없을 때 NOT_THE_CONTRACT_OWNER 예외를 던져야 합니다.', async () => {
    mockEthersService.withDraw.mockRejectedValue({
      reason: 'Not the contract owner',
    });
    await expect(service.withDraw()).rejects.toEqual(
      exceptions.NOT_THE_CONTRACT_OWNER
    );
  });
});
