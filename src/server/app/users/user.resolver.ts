import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt-gql-auth.guard';
import { GqlUser } from 'src/server/common/decorators/gql-user.decorator';

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
}
