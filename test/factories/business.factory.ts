import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Business } from 'src/server/app/businesses/business.entity';
import { addressFactory } from './address.factory';

export const businessFactory = FactoryBuilder.of(Business)
  .props({
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    businessNumber: faker.datatype.number().toString(),
    isGstRegistered: faker.datatype.boolean(),
    address: addressFactory.buildOne(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
