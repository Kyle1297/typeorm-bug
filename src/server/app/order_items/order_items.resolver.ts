import { Resolver } from '@nestjs/graphql';
import { OrderItemService } from './order_items.service';

@Resolver()
export class OrderItemResolver {
  constructor(private readonly orderItemService: OrderItemService) {}
}
