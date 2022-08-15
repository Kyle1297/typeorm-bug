import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { AddUserAddressInput } from 'src/server/app/user_addresses/input/add_user_address.input';
import { addressInstructions } from 'src/server/common/scalars/address_instruction.scalar';
import { addressTypes } from 'src/server/app/user_addresses/scalars/address_type.scalar';
import { UpdateUserAddressInput } from 'src/server/app/user_addresses/input/update_user_address.input';
import { UserAddress } from 'src/server/app/user_addresses/user_address.entity';
import { BusinessAddress } from 'src/server/app/business_addresses/business_address.entity';
import { WasherAddress } from 'src/server/app/washer_addresses/washer_address.entity';
import { OrderAddress } from 'src/server/app/order_addresses/order_address.entity';
import Stripe from 'stripe';

const addressFactory = FactoryBuilder.of(UserAddress)
  .props({
    line1: faker.address.streetAddress(),
    line2: faker.address.secondaryAddress(),
    locality: faker.address.city(),
    administrativeArea: faker.address.state(),
    postalCode: faker.address.zipCode(),
    countryCode: faker.address.countryCode(),
  })
  .build();

export const addUserAddressInputFactory = FactoryBuilder.of(AddUserAddressInput)
  .props({
    organisationName: faker.company.companyName(),
    instructions: faker.random.arrayElement(addressInstructions),
    additionalNotes: faker.lorem.sentence(),
    type: faker.random.arrayElement(addressTypes),
  })
  .mixins([addressFactory])
  .build();

export const updateUserAddressInputFactory = FactoryBuilder.of(
  UpdateUserAddressInput,
)
  .mixins([addUserAddressInputFactory])
  .build();

export const userAddressFactory = FactoryBuilder.of(UserAddress)
  .props({
    id: faker.datatype.uuid(),
    user: null,
    isSelectedDelivery: faker.datatype.boolean(),
    isSelectedPickup: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .mixins([addUserAddressInputFactory])
  .build();

export const businessAddressFactory = FactoryBuilder.of(BusinessAddress)
  .props({
    id: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .mixins([addressFactory])
  .build();

export const washerAddressFactory = FactoryBuilder.of(WasherAddress)
  .props({
    id: faker.datatype.uuid(),
    organisationName: faker.company.companyName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .mixins([addressFactory])
  .build();

export const orderAddressFactory = FactoryBuilder.of(OrderAddress)
  .props({
    id: faker.datatype.uuid(),
    organisationName: faker.company.companyName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .mixins([addressFactory])
  .build();

export const stripeAddressFactory = FactoryBuilder.of(Stripe['Address'])
  .props({
    city: faker.address.city(),
    country: faker.address.country(),
    line1: faker.address.streetAddress(),
    line2: faker.address.secondaryAddress(),
    postal_code: faker.address.zipCode(),
    state: faker.address.state(),
  })
  .build();
