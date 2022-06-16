// NEST
import { Injectable } from '@nestjs/common';

// TYPES
import {
  AlchemyWeb3,
  createAlchemyWeb3,
  GetNftsResponse,
} from '@alch/alchemy-web3';
import { GetAssetsDTO } from 'src/assets/dto/assets.dto';

// SERVICES
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlchemyService {
  public nftWeb3: AlchemyWeb3 | null = null;
  constructor(private configService: ConfigService) {}

  /**
   * It creates a new instance of AlchemyWeb3 if it doesn't exist.
   * @returns {AlchemyWeb3} The web3 instance for the NFT contract
   */
  getNFTWeb3(): AlchemyWeb3 {
    const isDev: boolean = this.configService.get('DEV');
    this.nftWeb3 ??= createAlchemyWeb3(
      `https://eth-${
        isDev ? 'rinkeby' : 'mainet'
      }.alchemyapi.io/nft/v2/${this.configService.get(
        `ALCHEMY_API_KEY_${isDev ? 'DEV' : 'PROD'}`,
      )}`,
    );
    return this.nftWeb3;
  }

  /**
   * It gets all the NFTs owned by a specific address, and filters out any NFTs that don't have a title
   * @param {GetAssetsDTO['address']} owner The address of the user you want to get NFTs for.
   * @returns {Promise<GetNftsResponse>} An array of NFTs
   */
  async getNFTs(owner: GetAssetsDTO['address']): Promise<GetNftsResponse> {
    const nfts = await this.getNFTWeb3().alchemy.getNfts({
      contractAddresses: [this.configService.get('OPENSEA_COLLECTION_ADDRESS')],
      owner,
    });
    nfts.ownedNfts = nfts.ownedNfts.filter((nft) => nft.title.length > 0);
    return nfts;
  }
}
