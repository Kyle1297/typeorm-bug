import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderRepository } from './order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository])],
  providers: [OrderResolver, OrderService],
  exports: [TypeOrmModule],
})
export class OrderModule {}
