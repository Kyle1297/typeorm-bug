import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { SocialProviderScalar } from '../app/auth/scalars/social_provider.scalar';
import { OrderStatusScalar } from '../app/orders/scalars/order_status.scalar';
import { OrderTimeslotScalar } from '../app/orders/scalars/order_timeslot.scalar';
import { AddressInstructionScalar } from '../common/scalars/address_instruction.scalar';
import { AddressTypeScalar } from '../app/user_addresses/scalars/address_type.scalar';
import { WasherStatusScalar } from '../app/washers/scalars/washer_status.scalar';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: join(process.cwd(), '..', 'schema.graphql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      debug: process.env.NODE_ENV === 'development',
      playground: process.env.NODE_ENV === 'development',
      resolvers: {
        SocialProviderScalar: SocialProviderScalar,
        AddressInstructionScalar: AddressInstructionScalar,
        AddressTypeScalar: AddressTypeScalar,
        WasherStatusScalar: WasherStatusScalar,
        OrderStatusScalar: OrderStatusScalar,
        OrderTimeslotScalar: OrderTimeslotScalar,
      },
    };
  }
}
