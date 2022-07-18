import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt-gql-auth.guard';
import { GqlUser } from 'src/server/common/decorators/gql-user.decorator';
import { Input } from '../graphql/args/input.args';
import {
  UpdateUserNameInput,
  UpdateUserPhoneInput,
} from './input/update-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async currentUser(@GqlUser() user: User): Promise<User> {
    return user;
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async removeCurrentUser(@GqlUser() user: User): Promise<User> {
    return this.userService.remove(user);
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async updateCurrentUserName(
    @GqlUser() user: User,
    @Input() input: UpdateUserNameInput,
  ) {
    return this.userService.update(user, input);
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async updateCurrentUserPhone(
    @GqlUser() user: User,
    @Input() input: UpdateUserPhoneInput,
  ) {
    return this.userService.update(user, input);
  }
}
