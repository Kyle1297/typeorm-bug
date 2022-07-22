import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductFeatureOption } from 'src/server/app/product_feature_options/product_feature_option.entity';
import { productFeatureOptionPriceFactory } from './price.factory';
import { ProductFeatureOptionVersion } from 'src/server/app/product_feature_option_versions/product_feature_option_version.entity';

export const productFeatureOptionFactory = FactoryBuilder.of(
  ProductFeatureOption,
)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.text(),
    isDefault: faker.datatype.boolean(),
    isAvailable: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();

export const productFeatureOptionVersionFactory = FactoryBuilder.of(
  ProductFeatureOptionVersion,
)
  .props({
    id: faker.datatype.uuid(),
    versionNumber: faker.datatype.number(),
    price: productFeatureOptionPriceFactory.buildOne(),
    productFeatureOption: productFeatureOptionFactory.buildOne(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
