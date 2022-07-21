import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Product } from 'src/server/app/products/product.entity';
import { productPriceFactory } from './price.factory';
import { productImageFactory } from './image.factory';

export const productFactory = FactoryBuilder.of(Product)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    image: productImageFactory.buildOne(),
    price: productPriceFactory.buildOne(),
    features: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
