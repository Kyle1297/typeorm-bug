import * as request from 'supertest';
import { userFactory } from '../../factories/user.factory';
import { gql } from 'apollo-server-express';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import { E2EApp, initializeApp } from '../test-utils/initialize-app';
import { addressFactory } from 'test/factories/address.factory';
import { User } from 'src/server/app/users/user.entity';

describe('UserModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('currentUser query', () => {
    const query = gql`
      query currentUser {
        currentUser {
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
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        addressFactory.buildOne({
          entityId: user.id,
          entityType: User.name,
          type: 'PICKUP_AND_DELIVERY',
          instructions: 'LEAVE_AT_DOOR',
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

      expect(result.body.data.currentUser.email).toBe(user.email);
      expect(result.body.data.currentUser.firstName).toBe(user.firstName);
      expect(result.body.data.currentUser.lastName).toBe(user.lastName);
      expect(result.body.data.currentUser.phoneCountryCode).toBe(
        user.phoneCountryCode,
      );
      expect(result.body.data.currentUser.phoneNumber).toBe(user.phoneNumber);
      expect(result.body.data.currentUser.addresses[0].id).toBe(address.id);
      expect(result.body.data.currentUser.createdAt).toBe(
        user.createdAt.toISOString(),
      );
      expect(result.body.data.currentUser.updatedAt).toBe(
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

  describe('removeCurrentUser mutation', () => {
    const query = gql`
      mutation removeCurrentUser {
        removeCurrentUser {
          email
        }
      }
    `.loc?.source.body;

    it('should remove current user, and return removed user', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.removeCurrentUser.email).toBe(user.email);
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
});
