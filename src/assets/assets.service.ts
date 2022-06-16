// NEST
import { Injectable } from '@nestjs/common';

// TYPES
import { GetNftsResponse } from '@alch/alchemy-web3';
import { GetAssetsDTO } from './dto/assets.dto';

// SERVICE
import { AlchemyService } from 'src/alchemy/alchemy.service';

@Injectable()
export class AssetsService {
  constructor(private alchemyService: AlchemyService) {}

  /**
   * It takes in a body object of type GetAssetsDTO, which is a class that has a single property of
   * type string called address. It then calls the getNFTs function from the alchemy service, which
   * returns an array of NFTs. It then returns that array of NFTs
   * @param {GetAssetsDTO} body - GetAssetsDTO - this is the body of the request. It's a class that
   * defines the parameters that are required for the request.
   * @returns {Promise<GetNftsResponse>} the nfts that are being returned from the alchemy service.
   */
  async getAllAssets(body: GetAssetsDTO): Promise<GetNftsResponse> {
    try {
      const nfts = await this.alchemyService.getNFTs(body.address);
      return nfts;
    } catch (err) {
      throw new Error(`Error getting assets ${err.message}`);
    }
  }
}
