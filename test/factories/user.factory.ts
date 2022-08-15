import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { LoginUserInput } from 'src/server/app/auth/inputs/login_user.input';
import { RegisterUserInput } from 'src/server/app/auth/inputs/register_user.input';
import { User } from 'src/server/app/users/user.entity';
import Stripe from 'stripe';
import { stripeAddressFactory } from './address.factory';

export const loginUserInputFactory = FactoryBuilder.of(LoginUserInput)
  .props({
    email: faker.internet.email(),
    password: faker.internet.password(10),
  })
  .build();

export const registerUserInputFactory = FactoryBuilder.of(RegisterUserInput)
  .props({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneCountryCode: 'AU',
    phoneNumber: faker.phone.phoneNumber('+61 431 ### ###'),
    locale: 'en-AU',
  })
  .mixins([loginUserInputFactory])
  .build();

export const userFactory = FactoryBuilder.of(User)
  .props({
    id: faker.datatype.uuid(),
    socialProviders: [],
    addresses: [],
    orders: [],
    stripeCustomerId: faker.datatype.uuid(),
    currencyCode: 'AUD',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .mixins([registerUserInputFactory])
  .build();

export const stripeCustomerFactory = FactoryBuilder.of(Stripe['Customer'])
  .props({
    id: faker.datatype.uuid(),
    object: 'customer',
    address: stripeAddressFactory.buildOne(),
    balance: 0,
    created: faker.date.past(),
    currency: 'AUD',
    default_currency: 'AUD',
    default_source: 'card',
    deleted: false,
    delinquent: false,
    description: faker.lorem.sentence(),
    discount: null,
    email: faker.internet.email(),
    invoice_credit_balance: undefined,
    invoice_prefix: '',
    invoice_settings: {
      custom_fields: [],
      default_payment_method: 'card',
      footer: '',
      rendering_options: null,
    },
    livemode: false,
    metadata: {
      orderId: faker.datatype.uuid(),
      userId: faker.datatype.uuid(),
    },
    name: faker.name.findName(),
    next_invoice_sequence: 1,
    phone: faker.phone.phoneNumber('+61 431 ### ###'),
    preferred_locales: [],
    shipping: {
      address: stripeAddressFactory.buildOne(),
      carrier: '',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber('+61 431 ### ###'),
      tracking_number: '',
    },
    sources: undefined,
    subscriptions: undefined,
    tax: undefined,
    tax_emempt: false,
    tax_ids: [],
    test_clock: undefined,
  })
  .build();
