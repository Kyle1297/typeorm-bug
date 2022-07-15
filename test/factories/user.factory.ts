import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { LoginUserInput } from 'src/server/app/auth/inputs/login-user.input';
import { RegisterUserInput } from 'src/server/app/auth/inputs/register-user.input';
import { User } from 'src/server/app/users/user.entity';

export const loginUserInputFactory = FactoryBuilder.of(LoginUserInput)
  .props({
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
  .build();

export const registerUserInputFactory = FactoryBuilder.of(RegisterUserInput)
  .props({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneCountryCode: faker.address.countryCode(),
    phoneNumber: faker.phone.phoneNumber(
      faker.random.arrayElement([
        '+61 ### ### ###',
        '+48 91 ### ## ##',
        '+1 ### ### ####',
      ]),
    ),
  })
  .mixins([loginUserInputFactory])
  .build();

export const userFactory = FactoryBuilder.of(User)
  .props({
    id: faker.datatype.uuid(),
  })
  .mixins([registerUserInputFactory])
  .build();
