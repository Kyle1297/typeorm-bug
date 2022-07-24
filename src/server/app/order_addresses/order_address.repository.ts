import { EntityRepository, Repository } from 'typeorm';
import { OrderAddress } from './order_address.entity';

@EntityRepository(OrderAddress)
export class OrderAddressRepository extends Repository<OrderAddress> {
  async findOneOrError(id: string): Promise<OrderAddress> {
    const orderAddress = await this.findOne(id);

    if (!orderAddress) {
      throw new Error(`Order address with id ${id} not found`);
    }

    return orderAddress;
  }
}
