import { EntityRepository, Repository } from 'typeorm';
import { BusinessAddress } from './business_address.entity';

@EntityRepository(BusinessAddress)
export class BusinessAddressRepository extends Repository<BusinessAddress> {}
