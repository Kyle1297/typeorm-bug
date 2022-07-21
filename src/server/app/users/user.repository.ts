import { EntityRepository, Repository } from 'typeorm';
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
      .leftJoinAndSelect('user.socialProviders', 'provider')
      .leftJoinAndSelect('user.addresses', 'address')
      .where('provider.socialId = :socialId', { socialId })
      .getOne();
  }

  findOneAndAllAddressesByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .where('user.email = :email', { email })
      .getOne();
  }
}
