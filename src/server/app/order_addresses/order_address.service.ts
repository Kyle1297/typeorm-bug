import { Injectable } from '@nestjs/common';
import validateEntity from 'src/server/common/utils/validateEntity';
import { UpdateOrderAddressInput } from './input/update_order_address.input';
import { OrderAddress } from './order_address.entity';
import { OrderAddressRepository } from './order_address.repository';

@Injectable()
export class OrderAddressService {
  constructor(
    private readonly orderAddressRepository: OrderAddressRepository,
  ) {}

  async update(
    id: string,
    orderAddressData: UpdateOrderAddressInput,
  ): Promise<OrderAddress> {
    const orderAddress = await this.orderAddressRepository.findOneOrError(id);

    // save does not trigger validation, so need to do it manually
    for (const [key, value] of Object.entries(orderAddressData)) {
      orderAddress[key] = value;
    }
    await validateEntity(orderAddress);

    return this.orderAddressRepository.save({ ...orderAddressData, id });
  }
}
