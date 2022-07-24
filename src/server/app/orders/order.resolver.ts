import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from 'src/server/common/decorators/gql_user.decorator';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt_gql_auth.guard';
import { Input } from '../graphql/args/input.args';
import { User } from '../users/user.entity';
import { CreateUnconfirmedOrderInput } from './input/create_unconfirmed_order.input';
import { UpdateOrderAddressesInput } from './input/update_order_addresses.input';
import { UpdateOrderDetailsInput } from './input/update_order_details.input';
import { UpdateOrderScheduleInput } from './input/update_order_schedule.input';
import { Order } from './order.entity';

import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGqlAuthGuard)
  @Query((_returns) => [Order])
  async orders(@GqlUser() user: User): Promise<Order[]> {
    return this.orderService.findAll(user.id);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Query((_returns) => Order)
  async order(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, user.id);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Order)
  async createUnconfirmedOrder(
    @GqlUser() user: User,
    @Input() input: CreateUnconfirmedOrderInput,
  ): Promise<Order> {
    return this.orderService.createUnconfirmed(input, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Order)
  async confirmOrder(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Order> {
    return this.orderService.confirm(id, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Order)
  async updateOrderAddresses(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) id: string,
    @Input() input: UpdateOrderAddressesInput,
  ): Promise<Order> {
    return this.orderService.updateAddresses(id, input, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Order)
  async updateOrderSchedule(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) id: string,
    @Input() input: UpdateOrderScheduleInput,
  ): Promise<Order> {
    return this.orderService.updateSchedule(id, input, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Order)
  async removeOrder(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Order> {
    return this.orderService.remove(id, user);
  }

  @UseGuards(JwtGqlAuthGuard)
  @Mutation((_returns) => Order)
  async updateOrderDetails(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) id: string,
    @Input() input: UpdateOrderDetailsInput,
  ): Promise<Order> {
    return this.orderService.updateDetails(id, input, user);
  }
}
