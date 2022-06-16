import { ApiProperty } from '@nestjs/swagger';

export class PayAndPrintResponseDTO {
  @ApiProperty({
    required: true,
    description: 'Returns the status of validation, ok if success.',
  })
  ok: boolean;

  @ApiProperty({
    required: true,
    description:
      'Returns the validation message for transaction, it will return an error if exists.',
  })
  message: string;

  @ApiProperty({
    required: true,
    description: 'Returns the payment transaction url.',
  })
  url?: string;

  @ApiProperty({
    required: true,
    description: 'Returns the session token id',
  })
  sessionId?: string;
}
