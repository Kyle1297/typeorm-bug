import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { AddressInstructionScalar } from '../app/addresses/scalars/AddressInstructionScalar';
import { AddressTypeScalar } from '../app/addresses/scalars/AddressTypeScalar';
import { SocialProviderScalar } from '../app/auth/scalars/SocialProviderScalar';

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
      },
    };
  }
}
