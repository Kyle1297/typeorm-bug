import { EntityRepository, Repository } from 'typeorm';
import { OrderAddress } from './order_address.entity';

@EntityRepository(OrderAddress)
export class OrderAddressRepository extends Repository<OrderAddress> {}
