import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductPrice } from 'src/server/app/product_prices/product_price.entity';
import { ProductFeatureOptionPrice } from 'src/server/app/product_feature_option_prices/product_feature_option_price.entity';

export const productPriceFactory = FactoryBuilder.of(ProductPrice)
  .props({
    id: faker.datatype.uuid(),
    isPerBag: faker.datatype.boolean(),
    audInCents: faker.datatype.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();

export const productFeatureOptionPriceFactory = FactoryBuilder.of(
  ProductFeatureOptionPrice,
)
  .props({
    id: faker.datatype.uuid(),
    isPerBag: faker.datatype.boolean(),
    audInCents: faker.datatype.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
