import * as request from 'supertest';
import { userFactory } from '../../factories/user.factory';
import { gql } from 'apollo-server-express';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import { E2EApp, initializeApp } from '../test_utils/initialize_app';
import * as faker from 'faker';
import {
  UpdateUserNameInput,
  UpdateUserPhoneInput,
} from 'src/server/app/users/input/update_user.input';
import { userAddressFactory } from 'test/factories/address.factory';

describe('UserModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('user query', () => {
    const query = gql`
      query user {
        user {
          id
          email
          firstName
          lastName
          phoneCountryCode
          phoneNumber
          addresses {
            id
          }
          createdAt
          updatedAt
        }
      }
    `.loc?.source.body;

    it('should return current user', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          type: 'PICKUP_AND_DELIVERY',
          user,
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [address],
        }),
      );

      const gqlReg = {
        query,
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.user.email).toBe(user.email);
      expect(result.body.data.user.firstName).toBe(user.firstName);
      expect(result.body.data.user.lastName).toBe(user.lastName);
      expect(result.body.data.user.phoneCountryCode).toBe(
        user.phoneCountryCode,
      );
      expect(result.body.data.user.phoneNumber).toBe(user.phoneNumber);
      expect(result.body.data.user.addresses[0].id).toBe(address.id);
      expect(result.body.data.user.createdAt).toBe(
        user.createdAt.toISOString(),
      );
      expect(result.body.data.user.updatedAt).toBe(
        user.updatedAt.toISOString(),
      );
    });

    it('should reject if user is not authenticated', async () => {
      const gqlReg = {
        query,
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe('Unauthorized');
    });
  });

  describe('updateUserName mutation', () => {
    const query = gql`
      mutation updateUserName($input: UpdateUserNameInput!) {
        updateUserName(input: $input) {
          id
          firstName
          lastName
        }
      }
    `.loc?.source.body;

    it("should update current user's name", async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          input: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.updateUserName.id).toBe(user.id);
      expect(result.body.data.updateUserName.firstName).toBe('John');
      expect(result.body.data.updateUserName.lastName).toBe('Doe');
    });

    it('should reject if user is not authenticated', async () => {
      const gqlReg = {
        query,
        variables: {
          input: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe('Unauthorized');
    });

    it('should reject if firstName or lastname is greater than 255 characters', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          input: {
            firstName: 'John'.repeat(256),
            lastName: 'Doe'.repeat(256),
          },
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        'firstName must be shorter than or equal to 255 characters, lastName must be shorter than or equal to 255 characters',
      );
    });
  });

  describe('updateUserPhone mutation', () => {
    const query = gql`
      mutation updateUserPhone($input: UpdateUserPhoneInput!) {
        updateUserPhone(input: $input) {
          id
          phoneCountryCode
          phoneNumber
        }
      }
    `.loc?.source.body;

    it("should update current user's phone", async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          input: {
            phoneCountryCode: 'AU',
            phoneNumber: '+61412345678',
          },
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.updateUserPhone.id).toBe(user.id);
      expect(result.body.data.updateUserPhone.phoneCountryCode).toBe('AU');
      expect(result.body.data.updateUserPhone.phoneNumber).toBe('+61412345678');
    });

    it('should reject if user is not authenticated', async () => {
      const gqlReg = {
        query,
        variables: {
          input: {
            phoneCountryCode: 'AU',
            phoneNumber: '+61412345678',
          },
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe('Unauthorized');
    });

    it('should reject if phoneCountryCode or phoneNumber is not valid', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          input: {
            phoneCountryCode: 'Invalid',
            phoneNumber: 'Invalid',
          },
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        'phoneCountryCode must be a valid ISO31661 Alpha2 code, phoneNumber must be a valid phone number',
      );
    });
  });

  describe('userExists query', () => {
    const query = gql`
      query userExists($email: String!) {
        userExists(email: $email)
      }
    `.loc?.source.body;

    it('should return true if user exists', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          email: user.email,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      expect(result.body.data.userExists).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const gqlReq = {
        query,
        variables: {
          email: faker.internet.email(),
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      expect(result.body.data.userExists).toBe(false);
    });
  });
});
