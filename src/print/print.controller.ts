// NEST
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';

// TYPES
import { PayAndPrintResponseDTO } from './dto/payAndPrintResponse.dto';
import { PayAndPrintRequestDTO } from './dto/payAndPrintRequest.dto';
import { SendToPrintRequestDTO } from './dto/sendToPrintRequest.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

// SERVICES
import { PrintService } from './print.service';

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
  async validateAndPay(
    @Body() body: PayAndPrintRequestDTO,
    @Res() res: Response,
  ) {
    try {
      const validation: PayAndPrintResponseDTO =
        await this.service.validateAndPay(body);
      res.status(HttpStatus.OK).json(validation);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  @Post('/sendToPrint')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayAndPrintResponseDTO,
    description: 'Print status.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Returns an error if email service breaks.',
  })
  async sendToPrint(@Body() body: SendToPrintRequestDTO, @Res() res: Response) {
    try {
      const sentStatus: PayAndPrintResponseDTO = await this.service.sendToPrint(
        body,
      );
      res.status(HttpStatus.OK).json(sentStatus);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}
