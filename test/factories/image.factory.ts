import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Image } from 'src/server/app/images/image.entity';

export const imageFactory = FactoryBuilder.of(Image)
  .props({
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    key: faker.random.word(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
