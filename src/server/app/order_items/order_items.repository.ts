import { EntityRepository, Repository } from 'typeorm';
import { OrderItem } from './order_items.entity';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {}
