// NEST
import { Injectable } from '@nestjs/common';

// TYPES
import { PayAndPrintRequestDTO } from 'src/print/dto/payAndPrintRequest.dto';
import { Nft } from '@alch/alchemy-web3';

// SERVICES
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe | null = null;
  constructor(private configService: ConfigService) {}

  /**
   * If the stripe object is not defined, then create
   * a new stripe object using the stripe key from the config service
   * @returns {Stripe} The stripe object
   */
  getStripe(): Stripe {
    const isDev: boolean = this.configService.get('DEV') === 'true';
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
   * @returns {Promise<Stripe.Response<Stripe.Checkout.Session>>} A Stripe.Response<Stripe.Checkout.Session>
   */
  async getSession(
    body: PayAndPrintRequestDTO,
    currentNFT: Nft,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    // CREATE A SESSION
    const session = await this.getStripe().checkout.sessions.create({
      line_items: [
        {
          price: this.configService.get('STRIPE_PRICE_ID'),
          adjustable_quantity: {
            enabled: true,
          },
          quantity: 1,
          tax_rates: [this.configService.get('STRIPE_TAXES_ID')],
        },
      ],
      shipping_options: [
        {
          shipping_rate: this.configService.get('STRIPE_SHIPPING_ID'),
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        title: currentNFT.title,
        description: currentNFT.description,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url: currentNFT.media?.[0]?.gateway,
      },
      mode: 'payment',
      success_url: `${body.successURL}?sessionID={CHECKOUT_SESSION_ID}`,
      cancel_url: `${body.cancelURL}?sessionID={CHECKOUT_SESSION_ID}`,
    });

    return session;
  }

  /**
   * It retrieves a session from Stripe
   * @param {string} id - The id of the session you want to retrieve.
   * @returns {Promise<Stripe.Checkout.Session>} A Stripe.Checkout.Session object.
   */
  async retrieveSession(id: string): Promise<Stripe.Checkout.Session> {
    return await this.getStripe().checkout.sessions.retrieve(id);
  }

  /**
   * "Retrieve a customer by ID."
   * The first line of the function is the function signature. It's a combination of the function name,
   * the parameters, and the return type
   * @param {string} id - The ID of the customer to retrieve.
   * @returns {Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>} A promise that resolves to a Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>
   */
  async retrieveCustomer(
    id: string,
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return await this.getStripe().customers.retrieve(id);
  }
}
