import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Price } from 'src/server/app/prices/price.entity';
import { productFactory } from './product.factory';

const product = productFactory.buildOne();

export const priceFactory = FactoryBuilder.of(Price)
  .props({
    id: faker.datatype.uuid(),
    isPerBag: faker.datatype.boolean(),
    aud_in_cents: faker.datatype.number(),
    entityId: product.id,
    entityType: 'Product',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
