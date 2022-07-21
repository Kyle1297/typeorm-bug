import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAddressService } from './order_address.service';
import { OrderAddressResolver } from './order_address.resolver';
import { OrderAddressRepository } from './order_address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderAddressRepository])],
  providers: [OrderAddressResolver, OrderAddressService],
  exports: [TypeOrmModule],
})
export class OrderAddressModule {}
