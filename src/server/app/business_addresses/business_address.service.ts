import { Injectable } from '@nestjs/common';
import { BusinessAddressRepository } from './business_address.repository';

@Injectable()
export class BusinessAddressService {
  constructor(
    private readonly businessAddressRepository: BusinessAddressRepository,
  ) {}
}
