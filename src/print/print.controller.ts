import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { PayAndPrintResponseDTO } from './dto/payAndPrintResponse.dto';
import { PayAndPrintRequestDTO } from './dto/payAndPrintRequest.dto';
import { ApiResponse } from '@nestjs/swagger';
import { PrintService } from './print.service';
import { Response } from 'express';

@Controller('print')
export class PrintController {
  constructor(private service: PrintService) {}

  @Post('/validateAndPay')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayAndPrintResponseDTO,
    description: 'Validate information to pay',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Returns an error if pay service breaks.',
  })
  async validateAndPrint(
    @Body() body: PayAndPrintRequestDTO,
    @Res() res: Response,
  ) {
    try {
      const validation: PayAndPrintResponseDTO =
        await this.service.validateAndPrint(body);
      res.status(HttpStatus.OK).json(validation);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}
