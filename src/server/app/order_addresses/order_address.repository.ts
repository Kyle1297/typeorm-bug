import { validateEntity } from 'src/server/common/utils/validateEntity';
import { EntityRepository, Repository } from 'typeorm';
import { UpdateOrderAddressInput } from './input/update_order_address.input';
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

  async updateOne(
    id: string,
    orderAddressData: UpdateOrderAddressInput,
  ): Promise<OrderAddress> {
    const orderAddress = await this.findOneOrError(id);

    // save does not trigger validation, so need to do it manually
    for (const [key, value] of Object.entries(orderAddressData)) {
      orderAddress[key] = value;
    }
    await validateEntity(orderAddress);

    return this.save({ ...orderAddressData, id });
  }
}
