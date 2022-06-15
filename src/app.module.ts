import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AssetsModule } from './assets/assets.module';
import { ConfigModule } from '@nestjs/config';
import { AlchemyModule } from './alchemy/alchemy.module';
import { PrintService } from './print/print.service';
import { PrintModule } from './print/print.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    AssetsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AlchemyModule,
    StripeModule,
    PrintModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrintService],
})
export class AppModule {}
