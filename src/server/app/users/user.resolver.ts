import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt_gql_auth.guard';
import { GqlUser } from 'src/server/common/decorators/gql_user.decorator';
import { Input } from '../graphql/args/input.args';
import {
  UpdateUserNameInput,
  UpdateUserPhoneInput,
} from './input/update_user.input';
import { PaymentService } from '../payments/payment.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
  ) {}

  @Query((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async user(@GqlUser() user: User): Promise<User> {
    return user;
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async updateUserName(
    @GqlUser() user: User,
    @Input() input: UpdateUserNameInput,
  ) {
    const updatedUser = await this.userService.update(user, input);

    // update stripe customer
    await this.paymentService.updateCustomer(user.stripeCustomerId, {
      name: updatedUser.fullName,
    });

    return updatedUser;
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async updateUserPhone(
    @GqlUser() user: User,
    @Input() input: UpdateUserPhoneInput,
  ) {
    const updatedUser = await this.userService.update(user, input);

    // update stripe customer
    await this.paymentService.updateCustomer(user.stripeCustomerId, {
      phone: updatedUser.phoneNumber,
    });

    return updatedUser;
  }

  @Query((_returns) => Boolean)
  async userExists(
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<boolean> {
    return this.userService.existsByCredentials({ email });
  }
}
