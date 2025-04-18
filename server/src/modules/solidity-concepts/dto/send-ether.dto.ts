import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendEtherDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
