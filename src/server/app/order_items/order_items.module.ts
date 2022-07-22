import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemService } from './order_items.service';
import { OrderItemResolver } from './order_items.resolver';
import { OrderItemRepository } from './order_items.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemRepository])],
  providers: [OrderItemResolver, OrderItemService],
  exports: [TypeOrmModule],
})
export class OrderItemModule {}
