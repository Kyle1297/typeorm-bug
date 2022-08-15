import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderRepository } from './order.repository';
import { PaymentModule } from '../payments/payment.module';
import { UserAddressModule } from '../user_addresses/user_address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository]),
    forwardRef(() => PaymentModule),
    UserAddressModule,
  ],
  providers: [OrderResolver, OrderService],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
