// NEST
import { Module } from '@nestjs/common';

// SERVICES
import { AppService } from './app.service';

// MODULES
import { AlchemyModule } from './alchemy/alchemy.module';
import { AssetsModule } from './assets/assets.module';
import { StripeModule } from './stripe/stripe.module';
import { PrintModule } from './print/print.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

// CONTROLLERS
import { AppController } from './app.controller';

@Module({
  imports: [
    AssetsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AlchemyModule,
    StripeModule,
    PrintModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
