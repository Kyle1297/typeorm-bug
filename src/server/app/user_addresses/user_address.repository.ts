import { EntityRepository, Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';

@EntityRepository(UserAddress)
export class UserAddressRepository extends Repository<UserAddress> {
  async findOneOrError(id: string): Promise<UserAddress> {
    const userAddress = await this.findOne(id, {
      relations: ['user'],
    });

    if (!userAddress) {
      throw new Error(`User address with id ${id} not found`);
    }

    return userAddress;
  }
}
