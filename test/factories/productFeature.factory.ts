import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductFeature } from 'src/server/app/product_features/productFeature.entity';
import { productFeatureOptionFactory } from './productFeatureOption';

export const productFeatureFactory = FactoryBuilder.of(ProductFeature)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    options: productFeatureOptionFactory.buildMany(2),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
