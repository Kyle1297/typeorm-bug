import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Input } from '../graphql/args/input.args';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt_gql_auth.guard';
import { GqlUser } from 'src/server/common/decorators/gql_user.decorator';
import { User } from '../users/user.entity';
import { UserAddress } from './user_address.entity';
import { AddUserAddressInput } from './input/add_user_address.input';
import { UserAddressService } from './user_address.service';
import { UpdateUserAddressInput } from './input/update_user_address.input';

@Resolver()
export class UserAddressResolver {
  constructor(private readonly userAddressService: UserAddressService) {}

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => UserAddress)
  async addUserAddress(
    @Input() input: AddUserAddressInput,
    @GqlUser() user: User,
  ): Promise<UserAddress> {
    return this.userAddressService.save(input, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => UserAddress)
  async removeUserAddress(
    @Args({ name: 'id', type: () => ID }) id: string,
    @GqlUser() user: User,
  ): Promise<UserAddress> {
    return this.userAddressService.remove(id, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => UserAddress)
  async updateUserAddress(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Input() input: UpdateUserAddressInput,
    @GqlUser() user: User,
  ): Promise<UserAddress> {
    return this.userAddressService.update(id, input, user);
  }
}
