import { Injectable } from '@nestjs/common';
import { validateEntity } from 'src/server/common/utils/validateEntity';
import { RegisterUserInput } from '../auth/inputs/register_user.input';
import { PaymentService } from '../payments/payment.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async create(userInput: RegisterUserInput): Promise<User> {
    const preparedUser = this.userRepository.create(userInput);
    const stripeCustomer = await this.paymentService.createCustomer(
      preparedUser,
    );
    preparedUser.stripeCustomerId = stripeCustomer.id;

    return await this.userRepository.save(preparedUser);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneAndAllAddressesByEmail(email);
  }

  findOneBySocialId(socialId: string): Promise<User | undefined> {
    return this.userRepository.findOneAndAllAddressesBySocialId(socialId);
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
