import { Resolver } from '@nestjs/graphql';
import { WasherAddressService } from './washer_address.service';
@Resolver()
export class WasherAddressResolver {
  constructor(private readonly washerAddressService: WasherAddressService) {}
}
