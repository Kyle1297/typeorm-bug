import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductFeatureOption } from 'src/server/app/product_feature_options/productFeatureOption.entity';
import { priceFactory } from './price.factory';
import { productFeatureFactory } from './productFeature.factory';

const id = faker.datatype.uuid();

export const productFeatureOptionFactory = FactoryBuilder.of(
  ProductFeatureOption,
)
  .props({
    id: id,
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    isDefault: faker.datatype.boolean(),
    productFeature: productFeatureFactory.buildOne(),
    price: priceFactory.buildOne({
      entityId: id,
      entityType: 'ProductFeatureOption',
    }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
