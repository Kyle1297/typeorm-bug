import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import stripeConfig from 'src/server/config/stripe.config';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [
    ConfigModule.forFeature(stripeConfig),
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get('stripe.apiKey'),
        apiVersion: configService.get('stripe.apiVersion'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => OrderModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
