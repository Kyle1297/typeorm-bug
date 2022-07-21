import { EntityRepository, Repository } from 'typeorm';
import { WasherAddress } from './washer_address.entity';

@EntityRepository(WasherAddress)
export class WasherAddressRepository extends Repository<WasherAddress> {}
