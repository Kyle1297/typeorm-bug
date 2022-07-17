import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Input } from '../graphql/args/input.args';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt-gql-auth.guard';
import { GqlUser } from 'src/server/common/decorators/gql-user.decorator';
import { User } from '../users/user.entity';
import { Address } from './address.entity';
import { AddAddressInput } from './input/add-address.input';
import { AddressService } from './address.service';

@Resolver()
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Address)
  async addAddress(
    @Input() input: AddAddressInput,
    @GqlUser() user: User,
  ): Promise<Address> {
    return this.addressService.save(input, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Address)
  async removeAddress(
    @Args({ name: 'id', type: () => ID }) id: string,
    @GqlUser() user: User,
  ): Promise<Address> {
    return this.addressService.remove(id, {
      entityId: user.id,
      entityType: User.name,
    });
  }
}
