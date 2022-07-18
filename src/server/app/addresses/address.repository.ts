import { EntityRepository, Repository } from 'typeorm';
import { Address } from './address.entity';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {
  async findOneOrError(id: string): Promise<Address> {
    const address = await this.findOne(id);

    if (!address) {
      throw new Error(`Address with id ${id} not found`);
    }

    return address;
  }
}
