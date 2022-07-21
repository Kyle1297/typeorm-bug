import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductFeatureOption } from 'src/server/app/product_feature_options/product_feature_option.entity';
import { productFeatureOptionPriceFactory } from './price.factory';

export const productFeatureOptionFactory = FactoryBuilder.of(
  ProductFeatureOption,
)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    isDefault: faker.datatype.boolean(),
    price: productFeatureOptionPriceFactory.buildOne(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
