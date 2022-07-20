import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Product } from 'src/server/app/products/product.entity';
import { imageFactory } from './image.factory';
import { priceFactory } from './price.factory';

const id = faker.datatype.uuid();

export const productFactory = FactoryBuilder.of(Product)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    image: imageFactory.buildOne(),
    price: priceFactory.buildOne({
      entityId: id,
      entityType: 'Product',
    }),
    features: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
