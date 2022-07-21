import { Resolver } from '@nestjs/graphql';
import { OrderAddressService } from './order_address.service';
@Resolver()
export class OrderAddressResolver {
  constructor(private readonly orderAddressService: OrderAddressService) {}
}
