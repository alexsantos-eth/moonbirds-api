import { Module } from '@nestjs/common';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { EmailService } from 'src/email/email.service';
import { StripeService } from 'src/stripe/stripe.service';
import { PrintController } from './print.controller';
import { PrintService } from './print.service';

@Module({
  imports: [AlchemyService, StripeService, EmailService],
  providers: [PrintService],
  controllers: [PrintController],
})
export class PrintModule {}
