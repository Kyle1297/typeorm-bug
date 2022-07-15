import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import jwtConfig from 'src/server/config/jwt.config';
import { User } from 'src/server/app/users/user.entity';
import { LoginSocialInput } from 'src/server/app/auth/inputs/login-social.input';
import {
  SocialProvider,
  SocialProviderTypes,
} from 'src/server/app/auth/auth.entity';
import { RegisterSocialInput } from 'src/server/app/auth/inputs/register-social.input';
import { userFactory } from './user.factory';

const config = jwtConfig();
const jwtService = new JwtService({
  secretOrPrivateKey: config.secret ?? 'jwt',
  signOptions: {
    expiresIn: config.expiresIn ?? '7 days',
  },
});

export function tokenFactory(user: Partial<User>) {
  return jwtService.sign({ email: user.email });
}

export function authHeaderFactory(user: Partial<User>) {
  const token = tokenFactory(user);
  return `Bearer ${token}`;
}

export const loginSocialInputFactory = FactoryBuilder.of(LoginSocialInput)
  .props({
    accessToken: faker.datatype.uuid(),
    provider: faker.random.arrayElement(Object.values(SocialProviderTypes)),
  })
  .build();

export const registerSocialInputFactory = FactoryBuilder.of(RegisterSocialInput)
  .props({
    phoneCountryCode: faker.address.countryCode(),
    phoneNumber: faker.phone.phoneNumber(
      faker.random.arrayElement([
        '+61 ### ### ###',
        '+48 91 ### ## ##',
        '+1 ### ### ####',
      ]),
    ),
  })
  .mixins([loginSocialInputFactory])
  .build();

const emailFactory = FactoryBuilder.of<Email>()
  .props({ value: faker.internet.email() })
  .build();

export const socialProfileFactory = FactoryBuilder.of<Profile>()
  .props({
    provider: faker.random.arrayElement(Object.values(SocialProviderTypes)),
    id: faker.datatype.uuid(),
    displayName: faker.internet.userName(),
    emails: emailFactory.buildMany(2),
    name: {
      givenName: faker.name.firstName(),
      familyName: faker.name.lastName(),
    },
  })
  .build();

interface Email {
  value: string;
}

export const socialProviderFactory = FactoryBuilder.of(SocialProvider)
  .props({
    provider: faker.random.arrayElement(Object.values(SocialProviderTypes)),
    socialId: faker.datatype.uuid(),
    user: userFactory.buildOne(),
    createdAt: faker.date.future(),
    updatedAt: faker.date.future(),
  })
  .build();
