import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SolidityConceptsService } from '../service/solidity-concepts.service';
import { SendEtherDto } from '../dto/send-ether.dto';

@Controller('solidity-concepts')
export class SolidityConceptsController {
  constructor(
    private readonly solidityConceptsService: SolidityConceptsService
  ) {}

  @Get('owner')
  async getOwner() {
    return await this.solidityConceptsService.getOwner();
  }

  @Get('owner/status')
  async checkOwner() {
    return await this.solidityConceptsService.ownerFunction();
  }

  @Get('fixed')
  async getFixed() {
    return await this.solidityConceptsService.fixedValue();
  }

  @Get('value')
  async getValue() {
    return await this.solidityConceptsService.getValue();
  }

  @Get('value/:value/status')
  async checkValue(@Param('value') value: number) {
    return await this.solidityConceptsService.checkValue(value);
  }

  @Get('value/:value/total')
  async sumValue(@Param('value') value: number) {
    return await this.solidityConceptsService.sumValue(value);
  }

  @Post('value')
  async updateValue(@Body() option: { value: number }) {
    return await this.solidityConceptsService.updateValue(option.value);
  }

  @Post('/transactions')
  async sendEther(@Body() sendEtherDto: SendEtherDto) {
    return await this.solidityConceptsService.sendEther(
      sendEtherDto.address,
      sendEtherDto.value
    );
  }

  @Get('contract/balance')
  async getContractBalance() {
    return await this.solidityConceptsService.getContractBalance();
  }

  @Post('contract/deposit')
  async deposit(@Body() option: { value: number }) {
    return await this.solidityConceptsService.deposit(option.value);
  }

  @Post('contract/withdraw')
  async withDraw() {
    return await this.solidityConceptsService.withDraw();
  }
}
