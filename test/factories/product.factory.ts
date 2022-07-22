import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductVersion } from 'src/server/app/product_versions/product_version.entity';
import { productPriceFactory } from './price.factory';
import { productImageFactory } from './image.factory';
import { Product } from 'src/server/app/products/product.entity';

export const productFactory = FactoryBuilder.of(Product)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    isAvailable: faker.datatype.boolean(),
    image: productImageFactory.buildOne(),
    features: [],
    versions: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();

export const productVersionFactory = FactoryBuilder.of(ProductVersion).props({
  id: faker.datatype.uuid(),
  versionNumber: faker.datatype.number(),
  product: productFactory.buildOne(),
  basePrice: productPriceFactory.buildOne(),
  deliveryCost: productPriceFactory.buildOne(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
});
