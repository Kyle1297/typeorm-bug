import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Washer } from 'src/server/app/washers/washer.entity';
import { washerStatuses } from 'src/server/app/washers/scalars/WasherStatusScalar';
import { addressFactory } from './address.factory';
import { businessFactory } from './business.factory';

export const washerFactory = FactoryBuilder.of(Washer)
  .props({
    id: faker.datatype.uuid(),
    status: faker.random.arrayElement(washerStatuses),
    lastStatusChangeAt: faker.date.past(),
    firstAbleToWorkAt: faker.date.past(),
    language: faker.locale,
    address: addressFactory.buildOne(),
    business: businessFactory.buildOne(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
