import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Washer } from 'src/server/app/washers/washer.entity';
import { businessFactory } from './business.factory';
import { washerStatuses } from 'src/server/app/washers/scalars/washer_status.scalar';
import { washerAddressFactory } from './address.factory';

export const washerFactory = FactoryBuilder.of(Washer)
  .props({
    id: faker.datatype.uuid(),
    status: faker.random.arrayElement(washerStatuses),
    lastStatusChangeAt: faker.date.past(),
    firstAbleToWorkAt: faker.date.past(),
    language: faker.locale,
    address: washerAddressFactory.buildOne(),
    business: businessFactory.buildOne(),
    user: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
