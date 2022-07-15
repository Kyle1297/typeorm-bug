import * as request from 'supertest';
import { userFactory } from '../../factories/user.factory';
import { gql } from 'apollo-server-express';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import { E2EApp, initializeApp } from '../test-utils/initialize-app';
import * as faker from 'faker';

describe('UserModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('users query', () => {
    const query = gql`
      query {
        users {
          id
          email
        }
      }
    `.loc?.source.body;

    it('should return users', async () => {
      const users = await e2e.dbTestUtils.saveMany([
        userFactory.buildOne({
          email: faker.internet.email(),
          id: faker.datatype.uuid(),
        }),
        userFactory.buildOne({
          email: faker.internet.email(),
          id: faker.datatype.uuid(),
        }),
      ]);

      const gqlReg = {
        query,
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.data.users.length).toBe(users.length);
    });
  });

  describe('user query', () => {
    const query = gql`
      query user($email: String!) {
        user(email: $email) {
          id
          email
        }
      }
    `.loc?.source.body;

    it('should return user with given email', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReg = {
        query,
        variables: {
          email: user.email,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.data.user.email).toBe(user.email);
    });
  });

  describe('removeUser mutation', () => {
    const query = gql`
      mutation remove($input: ID!) {
        removeUser(id: $input) {
          email
        }
      }
    `.loc?.source.body;

    it('should remove user, and return removed user', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          input: user.id,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.removeUser.email).toBe(user.email);
    });
  });
});
