import { Injectable } from '@nestjs/common';
import { OrderAddressRepository } from './order_address.repository';

@Injectable()
export class OrderAddressService {
  constructor(
    private readonly orderAddressRepository: OrderAddressRepository,
  ) {}
}
