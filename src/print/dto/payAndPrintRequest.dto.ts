import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PayAndPrintRequestDTO {
  @ApiProperty({
    required: true,
    maxLength: 42,
    minLength: 42,
    description: 'The ETH address of the owner of the assets.',
    example: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
  })
  @IsString()
  @Length(42, 42)
  address: string;

  @ApiProperty({
    required: true,
    maxLength: 42,
    minLength: 42,
    description: 'The ETH address of the NFT.',
    example: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
  })
  @IsString()
  @Length(42)
  nftAddress: string;

  @ApiProperty({
    required: true,
    description: 'The URL when the payment was correct.',
    example: 'https://example.com/success',
  })
  @IsString()
  successURL: string;

  @ApiProperty({
    required: true,
    description: 'The URL when the payment was canceled.',
    example: 'https://example.com/cancel',
  })
  @IsString()
  cancelURL: string;
}
