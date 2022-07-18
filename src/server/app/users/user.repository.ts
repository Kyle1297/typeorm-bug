import { EntityRepository, Repository } from 'typeorm';
import { Address } from '../addresses/address.entity';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.createQueryBuilder()
      .where('email = :email', { email })
      .getCount();

    return count > 0;
  }

  findOneAndAllAddressesBySocialId(
    socialId: string,
  ): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.socialProviders', 'providers')
      .leftJoinAndMapMany(
        'user.addresses',
        Address,
        'address',
        "address.entityId = user.id AND address.entityType = 'User'",
      )
      .where('providers.socialId = :socialId', { socialId })
      .getOne();
  }

  findOneAndAllAddressesByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.addresses',
        Address,
        'address',
        "address.entityId = user.id AND address.entityType = 'User'",
      )
      .where('user.email = :email', { email })
      .getOne();
  }
}
