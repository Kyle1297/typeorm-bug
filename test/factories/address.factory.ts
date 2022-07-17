import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Address } from 'src/server/app/addresses/address.entity';
import { AddAddressInput } from 'src/server/app/addresses/input/add-address.input';
import { User } from 'src/server/app/users/user.entity';
import { addressTypes } from 'src/server/app/addresses/scalars/AddressTypeScalar';
import { addressInstructions } from 'src/server/app/addresses/scalars/AddressInstructionScalar';

export const addAddressInputFactory = FactoryBuilder.of(AddAddressInput)
  .props({
    organisationName: faker.company.companyName(),
    line1: faker.address.streetAddress(),
    line2: faker.address.secondaryAddress(),
    locality: faker.address.city(),
    administrativeArea: faker.address.state(),
    postalCode: faker.address.zipCode(),
    countryCode: faker.address.countryCode(),
    instructions: faker.random.arrayElement(addressInstructions),
    additionalNotes: faker.lorem.sentence(),
    type: faker.random.arrayElement(addressTypes),
  })
  .build();

export const addressFactory = FactoryBuilder.of(Address)
  .props({
    id: faker.datatype.uuid(),
    entityId: faker.datatype.uuid(),
    entityType: User.name,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .mixins([addAddressInputFactory])
  .build();
