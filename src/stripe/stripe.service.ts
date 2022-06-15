import { Nft } from '@alch/alchemy-web3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayAndPrintRequestDTO } from 'src/print/dto/payAndPrintRequest.dto';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe | null = null;
  constructor(private configService: ConfigService) {}

  /**
   * If the stripe object is not defined, then create
   * a new stripe object using the stripe key from the config service
   * @returns The stripe object
   */
  getStripe() {
    const isDev: boolean = this.configService.get('DEV');
    this.stripe ??= new Stripe(
      this.configService.get(`STRIPE_${isDev ? 'DEV' : 'PROD'}`),
      {
        apiVersion: '2020-08-27',
      },
    );
    return this.stripe;
  }

  /**
   * It creates a Stripe session for the user to pay for the NFT
   * @param {PayAndPrintRequestDTO} body - PayAndPrintRequestDTO
   * @param {Nft} currentNFT - Nft - This is the NFT that the user is trying to purchase.
   * @returns A Stripe.Response<Stripe.Checkout.Session>
   */
  async getSession(
    body: PayAndPrintRequestDTO,
    currentNFT: Nft,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    // CREATE A SESSION
    const session = await this.getStripe().checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              description: currentNFT.description,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              images: currentNFT.media?.map((media) => media.gateway) ?? [],
              name: currentNFT.title,
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: body.successURL,
      cancel_url: body.cancelURL,
    });

    return session;
  }
}
