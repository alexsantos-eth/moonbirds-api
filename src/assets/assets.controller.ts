// NEST
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';

// TYPES
import { GetNFTAssetsResponseDTO } from 'src/alchemy/dto/getnftsresponse.dto';
import { GetNftsResponse } from '@alch/alchemy-web3';
import { GetAssetsDTO } from './dto/assets.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

// SERVICES
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private service: AssetsService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetNFTAssetsResponseDTO,
    description: 'Returns a list of nfts for Moonbirds collection.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Returns an error if alchemy service breaks.',
  })
  async getAllAssets(@Query() queryBody: GetAssetsDTO, @Res() res: Response) {
    try {
      const list: GetNftsResponse = await this.service.getAllAssets(queryBody);
      res.status(HttpStatus.OK).json(list);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}
