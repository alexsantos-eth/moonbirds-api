/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';

import { PayAndPrintResponseDTO } from './dto/payAndPrintResponse.dto';
import { PayAndPrintRequestDTO } from './dto/payAndPrintRequest.dto';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { StripeService } from 'src/stripe/stripe.service';

import { Nft } from '@alch/alchemy-web3';

@Injectable()
export class PrintService {
  constructor(
    private alchemyService: AlchemyService,
    private stripeService: StripeService,
  ) {}

  /**
   * It takes a PayAndPrintRequestDTO as a parameter, and
   * returns a PayAndPrintResponseDTO to validate if some nfts its ownen by an address
   * @param {PayAndPrintRequestDTO} body - PayAndPrintRequestDTO
   * @returns A boolean and a message.
   */
  async validateAndPrint(
    body: PayAndPrintRequestDTO,
  ): Promise<PayAndPrintResponseDTO> {
    try {
      const nfts = await this.alchemyService.getNFTs(body.address);

      // SEARCH FOR NFT
      let theWalletHasTheNFT = false;
      let currentNFT: Nft | null = null;
      nfts.ownedNfts.forEach((nft) => {
        if (nft.id.tokenId === body.nftAddress) {
          theWalletHasTheNFT = true;
          currentNFT = nft;
        }
      });

      // NFT ERROR
      if (!theWalletHasTheNFT)
        return {
          ok: theWalletHasTheNFT,
          message: theWalletHasTheNFT ? 'The wallet doesnt have this NFT' : '',
        };

      // CREATE A SESSION
      const session = await this.stripeService.getSession(body, currentNFT);

      // REDIRECTS
      return {
        ok: theWalletHasTheNFT,
        message: `Payment status: ${session.payment_status}`,
        url: session.url,
      };
    } catch (err) {
      throw new Error(`Error in payment`);
    }
  }
}
