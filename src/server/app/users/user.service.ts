import { Injectable } from '@nestjs/common';
import validateEntity from 'src/server/common/utils/validateEntity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  save(user: Partial<User>): Promise<User> {
    const preparedUser = this.userRepository.create(user);
    return this.userRepository.save(preparedUser);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneAndAllAddressesByEmail(email);
  }

  findOneBySocialId(socialId: string): Promise<User | undefined> {
    return this.userRepository.findOneAndAllAddressesBySocialId(socialId);
  }

  async remove(user: User): Promise<User> {
    return this.userRepository.remove(user);
  }

  existsByCredentials(user: Pick<User, 'email'>): Promise<boolean> {
    return this.userRepository.existsByEmail(user.email);
  }

  async update(user: User, userData: Partial<User>): Promise<User> {
    for (const [key, value] of Object.entries(userData)) {
      user[key] = value;
    }

    await validateEntity(user);

    return this.userRepository.save({ ...userData, id: user.id });
  }
}
