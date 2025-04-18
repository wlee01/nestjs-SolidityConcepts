import { Module } from '@nestjs/common';
import { SolidityConceptsService } from './service/solidity-concepts.service';
import { SolidityConceptsController } from './controller/solidity-concepts.controller';
import { EthersService } from '../ethers/ethers.service';

@Module({
  controllers: [SolidityConceptsController],
  providers: [SolidityConceptsService, EthersService],
})
export class SolidityConceptsModule {}
