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

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ email });
  }

  findOneBySocialId(socialId: string): Promise<User | undefined> {
    return this.usersRepository.findOneBySocialId(socialId);
  }

  async remove(id: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    return this.usersRepository.remove(user);
  }

  existsByCredentials(user: Pick<User, 'email'>): Promise<boolean> {
    return this.usersRepository.existsByEmail(user.email);
  }
}
