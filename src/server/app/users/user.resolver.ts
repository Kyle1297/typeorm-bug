import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt-gql-auth.guard';
import { GqlUser } from 'src/server/common/decorators/gql-user.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((_returns) => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query((_returns) => User)
  async user(@Args('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Query((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async me(@GqlUser() user: User): Promise<User> {
    return user;
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtGqlAuthGuard)
  async removeUser(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<User> {
    return this.userService.remove(id);
  }
}
