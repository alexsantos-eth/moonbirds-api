/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';

// TYPES
import { PayAndPrintResponseDTO } from './dto/payAndPrintResponse.dto';
import { PayAndPrintRequestDTO } from './dto/payAndPrintRequest.dto';
import { SendToPrintRequestDTO } from './dto/sendToPrintRequest.dto';
import { Nft } from '@alch/alchemy-web3';

// SERVICES
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { StripeService } from 'src/stripe/stripe.service';
import { EmailService } from 'src/email/email.service';
import Stripe from 'stripe';

@Injectable()
export class PrintService {
  constructor(
    private alchemyService: AlchemyService,
    private stripeService: StripeService,
    private emailService: EmailService,
  ) {}

  /**
   * It takes a PayAndPrintRequestDTO as a parameter, and
   * returns a PayAndPrintResponseDTO to validate if some nfts its ownen by an address
   * @param {PayAndPrintRequestDTO} body - PayAndPrintRequestDTO
   * @returns {Promise<PayAndPrintResponseDTO>} A boolean and a message.
   */
  async validateAndPay(
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
        sessionId: session.id,
        url: session.url,
      };
    } catch (err) {
      throw new Error(`Error in payment`);
    }
  }

  /**
   * It retrieves the customer from Stripe, sends an email to the customer, and returns a response
   * @param {SendToPrintRequestDTO} body - SendToPrintRequestDTO
   * @returns A PayAndPrintResponseDTO
   */
  async sendToPrint(
    body: SendToPrintRequestDTO,
  ): Promise<PayAndPrintResponseDTO> {
    // GET CUSTOMER
    const session = await this.stripeService.retrieveSession(body.sessionID);
    const customer: Stripe.Customer | Stripe.DeletedCustomer =
      await this.stripeService.retrieveCustomer(session.customer as string);

    // PAYMENT FAILED
    if (session.payment_status !== 'paid')
      throw new Error('The session was unpaid');

    // CUSTOMER DELETED
    if (customer.deleted) throw new Error('The user is deleted');

    try {
      await this.emailService.sendMail({
        to: (customer as Stripe.Customer).email,
        subject: 'New order from page',
        template: 'paymentSummary',
        context: {
          ...session.metadata,
          name: (customer as Stripe.Customer).name,
          date: new Date().toLocaleString(),
          email: (customer as Stripe.Customer).email,
          phone: (customer as Stripe.Customer).phone,
        },
      });

      // SUCCESS
      return {
        ok: true,
        message: 'Email sended',
      };
    } catch (emailError) {
      throw new Error(emailError);
    }
  }
}
