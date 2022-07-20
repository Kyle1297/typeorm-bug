import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { ProductImage } from 'src/server/app/product_images/productImage.entity';
import { OrderImage } from 'src/server/app/order_images/orderImage.entity';

export const productImageFactory = FactoryBuilder.of(ProductImage)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    key: faker.random.word(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();

export const orderImageFactory = FactoryBuilder.of(OrderImage)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    key: faker.random.word(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
