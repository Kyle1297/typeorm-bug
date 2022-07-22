import { Injectable } from '@nestjs/common';
import { OrderItemRepository } from './order_items.repository';

@Injectable()
export class OrderItemService {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}
}
