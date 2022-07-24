import { Injectable } from '@nestjs/common';
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
    return this.orderAddressRepository.updateOne(id, orderAddressData);
  }
}
