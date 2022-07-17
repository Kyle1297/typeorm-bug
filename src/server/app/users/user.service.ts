import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  save(user: Partial<User>): Promise<User> {
    const preparedUser = this.usersRepository.create(user);
    return this.usersRepository.save(preparedUser);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneAndAllAddressesByEmail(email);
  }

  findOneBySocialId(socialId: string): Promise<User | undefined> {
    return this.usersRepository.findOneAndAllAddressesBySocialId(socialId);
  }

  async remove(user: User): Promise<User> {
    return this.usersRepository.remove(user);
  }

  existsByCredentials(user: Pick<User, 'email'>): Promise<boolean> {
    return this.usersRepository.existsByEmail(user.email);
  }
}
