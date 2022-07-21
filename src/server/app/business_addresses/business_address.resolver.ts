import { Resolver } from '@nestjs/graphql';
import { BusinessAddressService } from './business_address.service';
@Resolver()
export class BusinessAddressResolver {
  constructor(
    private readonly businessAddressService: BusinessAddressService,
  ) {}
}
