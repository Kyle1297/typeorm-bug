import { gql } from 'apollo-server-express';
import * as request from 'supertest';
import {
  loginUserInputFactory,
  registerUserInputFactory,
  userFactory,
} from '../../factories/user.factory';
import { GQL } from '../constants';

import {
  loginSocialInputFactory,
  registerSocialInputFactory,
  socialProfileFactory,
  socialProviderFactory,
} from '../../factories/auth.factory';
import { Profile } from 'passport';
import { E2EApp, initializeApp } from '../test-utils/initialize-app';
import { InvalidCredentialsError } from 'src/server/app/auth/responses/invalid-credentials.error';
import { AuthUserResponse } from 'src/server/app/auth/responses/auth-user.response';
import { InvalidInputError } from 'src/server/app/graphql/responses/invalid-input.error';
import { CredentialsTakenError } from 'src/server/app/auth/responses/credentials-taken.error';
import { SocialNotRegisteredError } from 'src/server/app/auth/responses/social-not-registered.error';
import { SocialAlreadyAssignedError } from 'src/server/app/auth/responses/social-already-assigned.error';
import {
  socialProviderTypes,
  SocialProviderTypes,
} from 'src/server/app/auth/scalars/SocialProviderScalar';
import { LoginSocialInput } from 'src/server/app/auth/inputs/login-social.input';
import { RegisterSocialInput } from 'src/server/app/auth/inputs/register-social.input';
import { ErrorResponse } from 'src/server/app/graphql/interfaces/error-response.interface';

describe('AuthModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('login mutation', () => {
    const query = gql`
      mutation login($input: LoginUserInput!) {
        login(input: $input) {
          __typename
          ... on ErrorResponse {
            message
          }
          ... on AuthUserResponse {
            user {
              id
              email
              firstName
              lastName
              phoneCountryCode
              phoneNumber
            }
            token
          }
          ... on InvalidCredentialsError {
            providedEmail
            message
          }
        }
      }
    `.loc?.source.body;

    it('should login user with correct credentials', async () => {
      const userLoginInput = loginUserInputFactory.buildOne();
      const user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne(userLoginInput),
      );

      const gqlReq = {
        query,
        variables: {
          input: userLoginInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post('/graphql')
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.login;
      expect(response.__typename).toBe(AuthUserResponse.name);
      expect(response.user.email).toBe(user.email);
      expect(response.user.firstName).toBe(user.firstName);
      expect(response.user.lastName).toBe(user.lastName);
      expect(response.user.phoneCountryCode).toBe(user.phoneCountryCode);
      expect(response.user.phoneNumber).toBe(user.phoneNumber);
      expect(response.token).toBeTruthy();
    });

    it('should reject if password is invalid', async () => {
      const userLoginInput = loginUserInputFactory.buildOne();
      await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...userLoginInput,
          password: 'invalid',
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: userLoginInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post('/graphql')
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.login;
      expect(response.__typename).toBe(InvalidCredentialsError.name);
      expect(response.providedEmail).toBe(userLoginInput.email);
    });
  });

  describe('register mutation', () => {
    const query = gql`
      mutation register($input: RegisterUserInput!) {
        register(input: $input) {
          __typename
          ... on ErrorResponse {
            message
          }
          ... on AuthUserResponse {
            user {
              id
              email
              firstName
              lastName
              phoneCountryCode
              phoneNumber
            }
            token
          }
          ... on CredentialsTakenError {
            providedEmail
          }
          ... on InvalidInputError {
            errors {
              field
              messages
            }
          }
        }
      }
    `.loc?.source.body;

    it('should create user, and then return user data', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(AuthUserResponse.name);
      expect(response.user.email).toBe(registerUserInput.email);
      expect(response.user.firstName).toBe(registerUserInput.firstName);
      expect(response.user.lastName).toBe(registerUserInput.lastName);
      expect(response.user.phoneCountryCode).toBe(
        registerUserInput.phoneCountryCode,
      );
      expect(response.user.phoneNumber).toBe(registerUserInput.phoneNumber);
      expect(response.token).toBeTruthy();
    });

    it('should return inputs errors if inputs is invalid', async () => {
      const registerUserInput = registerUserInputFactory.buildOne({
        email: 'invalid',
        password: 'short',
      });

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(InvalidInputError.name);
      expect(response.errors.length).toBe(2);
    });

    it('should not allow to register if similar user exists', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      await e2e.dbTestUtils.saveOne(userFactory.buildOne(registerUserInput));

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(CredentialsTakenError.name);
      expect(response.providedEmail).toBe(registerUserInput.email);
    });
  });

  describe.each(socialProviderTypes)(
    `SocialAuth %s`,
    (provider: SocialProviderTypes) => {
      let socialProfile: Profile;

      beforeEach(async () => {
        socialProfile = socialProfileFactory.buildOne({ provider });
        const strategyImport =
          await require(`../../../src/server/app/auth/strategy/${provider}.strategy`);
        const Strategy = await e2e.app.get(Object.keys(strategyImport)[0]);
        jest
          .spyOn(Strategy, 'userProfile')
          .mockImplementation((token: any, func: any) => {
            return func(null, socialProfile);
          });
      });

      describe(`loginSocial ${provider}`, () => {
        const query = gql`
          mutation loginSocial($input: LoginSocialInput!) {
            loginSocial(input: $input) {
              __typename
              ... on ErrorResponse {
                message
              }
              ... on AuthUserResponse {
                user {
                  id
                  email
                  firstName
                  lastName
                  phoneCountryCode
                  phoneNumber
                }
                token
              }
              ... on SocialNotRegisteredError {
                provider
              }
            }
          }
        `.loc?.source.body;

        const loginSocialInput = loginSocialInputFactory.buildOne({
          provider,
        });

        const gqlReq = {
          query,
          variables: {
            input: {
              ...loginSocialInput,
              provider: provider,
            },
          },
        };

        it(`should login ${provider} social account correctly`, async () => {
          const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
          await e2e.dbTestUtils.saveOne(
            socialProviderFactory.buildOne({
              ...loginSocialInput,
              socialId: socialProfile.id,
              user,
            }),
          );

          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.loginSocial;

          expect(response.__typename).toBe(AuthUserResponse.name);
          expect(response.user.email).toBe(user.email);
          expect(response.user.firstName).toBe(user.firstName);
          expect(response.user.lastName).toBe(user.lastName);
          expect(response.user.phoneCountryCode).toBe(user.phoneCountryCode);
          expect(response.user.phoneNumber).toBe(user.phoneNumber);
          expect(response.token).toBeTruthy();
        });

        it(`should return errors if ${provider} social account is not registered`, async () => {
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.loginSocial;
          expect(response.__typename).toBe(SocialNotRegisteredError.name);
          expect(response.provider).toBe(provider);
        });

        it(`should return errors, if ${provider} login is not successful`, async () => {
          socialProfile = null as any;
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const response = result.body.errors;

          expect(response.length).toBe(1);
        });
      });

      describe(`registerSocial ${provider}`, () => {
        const query = gql`
          mutation registerSocial($input: RegisterSocialInput!) {
            registerSocial(input: $input) {
              __typename
              ... on ErrorResponse {
                message
              }
              ... on AuthUserResponse {
                user {
                  id
                  email
                  firstName
                  lastName
                  phoneCountryCode
                  phoneNumber
                }
                token
              }
              ... on CredentialsTakenError {
                providedEmail
              }
              ... on SocialAlreadyAssignedError {
                provider
              }
            }
          }
        `.loc?.source.body;

        const registerSocialInput = registerSocialInputFactory.buildOne({
          provider,
        });

        const gqlReq = {
          query,
          variables: {
            input: {
              ...registerSocialInput,
              provider: provider,
            },
          },
        };

        it(`should register ${provider} social account correctly`, async () => {
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(AuthUserResponse.name);
          expect(response.user.email).toBe(socialProfile.emails[0].value);
          expect(response.user.firstName).toBe(socialProfile.name.givenName);
          expect(response.user.lastName).toBe(socialProfile.name.familyName);
          expect(response.user.phoneCountryCode).toBe(
            registerSocialInput.phoneCountryCode,
          );
          expect(response.user.phoneNumber).toBe(
            registerSocialInput.phoneNumber,
          );
          expect(response.token).toBeTruthy();
        });

        it(`should return error if ${provider} account is already assigned`, async () => {
          await e2e.dbTestUtils.saveOne(
            socialProviderFactory.buildOne({
              socialId: socialProfile.id,
              user: await e2e.dbTestUtils.saveOne(userFactory.buildOne()),
            }),
          );

          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(SocialAlreadyAssignedError.name);
          expect(response.provider).toBe(provider);
        });

        it(`should return error if ${provider} credentials are already taken`, async () => {
          await e2e.dbTestUtils.saveOne(
            userFactory.buildOne({
              email: socialProfile.emails[0].value,
            }),
          );

          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(CredentialsTakenError.name);
          expect(response.providedEmail).toBe(socialProfile.emails[0].value);
        });

        it(`should return errors, if ${provider} social register is not successful`, async () => {
          socialProfile = null as any;
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const response = result.body.errors;

          expect(response.length).toBe(1);
        });
      });
    },
  );
});
