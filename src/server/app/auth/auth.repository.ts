import { EntityRepository, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { SocialProvider } from './auth.entity';

@EntityRepository(SocialProvider)
export class SocialProviderRepository extends Repository<SocialProvider> {
  async existsBySocialId(socialId: string): Promise<boolean> {
    const count = await this.createQueryBuilder('provider')
      .where('provider.socialId = :socialId', { socialId })
      .getCount();
    return count > 0;
  }

  saveProviderAndUser(user: Partial<User>, provider: Partial<SocialProvider>) {
    return this.manager.transaction(async (transactionalManager) => {
      const createdUser = transactionalManager.create(User, user);
      const savedUser = await transactionalManager.save(createdUser);
      const createdSocialProvider = transactionalManager.create(
        SocialProvider,
        {
          user: savedUser,
          ...provider,
        },
      );
      await transactionalManager.save(createdSocialProvider);

      return savedUser;
    });
  }
}
