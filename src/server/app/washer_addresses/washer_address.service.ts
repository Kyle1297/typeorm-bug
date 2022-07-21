import { Injectable } from '@nestjs/common';
import { WasherAddressRepository } from './washer_address.repository';

@Injectable()
export class WasherAddressService {
  constructor(
    private readonly washerAddressRepository: WasherAddressRepository,
  ) {}
}
