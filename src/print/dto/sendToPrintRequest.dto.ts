import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendToPrintRequestDTO {
  @ApiProperty({
    required: true,
    description: 'The payment token id in success page',
  })
  @IsString()
  sessionID: string;
}
