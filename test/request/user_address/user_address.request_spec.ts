import { E2EApp, initializeApp } from '../test_utils/initialize_app';
import { gql } from 'apollo-server-express';
import { userFactory } from '../../factories/user.factory';
import * as request from 'supertest';
import * as faker from 'faker';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import {
  addUserAddressInputFactory,
  updateUserAddressInputFactory,
  userAddressFactory,
} from 'test/factories/address.factory';
import { AddUserAddressInput } from 'src/server/app/user_addresses/input/add_user_address.input';
import { UpdateUserAddressInput } from 'src/server/app/user_addresses/input/update_user_address.input';

describe('AddressModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('addUserAddress mutation', () => {
    const query = gql`
      mutation addUserAddress($input: AddUserAddressInput!) {
        addUserAddress(input: $input) {
          __typename
          id
          organisationName
          line1
          line2
          locality
          administrativeArea
          postalCode
          countryCode
          instructions
          additionalNotes
          type
        }
      }
    `.loc?.source.body;

    it('should add a valid address with all fields', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne();
      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const addUserAddress = result.body.data.addUserAddress;
      expect(addUserAddress.organisationName).toEqual(
        addUserAddressInput.organisationName,
      );
      expect(addUserAddress.line1).toEqual(addUserAddressInput.line1);
      expect(addUserAddress.line2).toEqual(addUserAddressInput.line2);
      expect(addUserAddress.locality).toEqual(addUserAddressInput.locality);
      expect(addUserAddress.administrativeArea).toEqual(
        addUserAddressInput.administrativeArea,
      );
      expect(addUserAddress.postalCode).toEqual(addUserAddressInput.postalCode);
      expect(addUserAddress.countryCode).toEqual(
        addUserAddressInput.countryCode,
      );
      expect(addUserAddress.instructions).toEqual(
        addUserAddressInput.instructions,
      );
      expect(addUserAddress.additionalNotes).toEqual(
        addUserAddressInput.additionalNotes,
      );
      expect(addUserAddress.type).toEqual(addUserAddressInput.type);
    });

    it('should add a valid address with only required fields', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP_AND_DELIVERY',
        line2: undefined,
        organisationName: undefined,
      });

      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const addUserAddress = result.body.data.addUserAddress;
      expect(addUserAddress.organisationName).toEqual('');
      expect(addUserAddress.line1).toEqual(addUserAddressInput.line1);
      expect(addUserAddress.line2).toEqual('');
      expect(addUserAddress.locality).toEqual(addUserAddressInput.locality);
      expect(addUserAddress.administrativeArea).toEqual(
        addUserAddressInput.administrativeArea,
      );
      expect(addUserAddress.postalCode).toEqual(addUserAddressInput.postalCode);
      expect(addUserAddress.countryCode).toEqual(
        addUserAddressInput.countryCode,
      );
      expect(addUserAddress.instructions).toEqual(
        addUserAddressInput.instructions,
      );
      expect(addUserAddress.additionalNotes).toEqual(
        addUserAddressInput.additionalNotes,
      );
      expect(addUserAddress.type).toEqual(addUserAddressInput.type);
    });

    it('should reject when user is not authenticated', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne();
      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual('Unauthorized');
    });
  });

  describe('removeUserAddress mutation', () => {
    const query = gql`
      mutation removeUserAddress($input: ID!) {
        removeUserAddress(id: $input) {
          line1
        }
      }
    `.loc?.source.body;

    it('should remove user, and return removed user', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: address.id,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.removeUserAddress.line1).toBe(address.line1);
    });

    it('should reject if user is not authenticated', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: address.id,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe('Unauthorized');
    });

    it('should reject if user is not the owner of the address', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
        }),
      );

      const otherUser = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          id: faker.datatype.uuid(),
          email: faker.internet.email(),
        }),
      );
      const gqlReq = {
        query,
        variables: {
          input: address.id,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(otherUser))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        `Unauthorized: Only the owner of this address can remove it`,
      );
    });

    it('should reject if address does not exist', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const gqlReq = {
        query,
        variables: {
          input: faker.datatype.uuid(),
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        `User address with id ${gqlReq.variables.input} not found`,
      );
    });
  });

  describe('updateUserAddress mutation', () => {
    const query = gql`
      mutation updateUserAddress($id: ID!, $input: UpdateUserAddressInput!) {
        updateUserAddress(id: $id, input: $input) {
          __typename
          id
          organisationName
          line1
          line2
          locality
          administrativeArea
          postalCode
          countryCode
          instructions
          additionalNotes
          type
        }
      }
    `.loc?.source.body;

    it('should update user, and return updated user', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
        }),
      );
      const addressInput = updateUserAddressInputFactory.buildOne({
        organisationName: faker.company.companyName(),
        line1: faker.address.streetAddress(),
        line2: faker.address.secondaryAddress(),
        locality: faker.address.city(),
        administrativeArea: faker.address.state(),
        postalCode: faker.address.zipCode(),
        countryCode: faker.address.countryCode(),
      });

      const gqlReq = {
        query,
        variables: {
          id: address.id,
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.updateUserAddress.id).toBe(address.id);
      expect(result.body.data.updateUserAddress.organisationName).toBe(
        addressInput.organisationName,
      );
      expect(result.body.data.updateUserAddress.line1).toBe(addressInput.line1);
      expect(result.body.data.updateUserAddress.line2).toBe(addressInput.line2);
      expect(result.body.data.updateUserAddress.locality).toBe(
        addressInput.locality,
      );
      expect(result.body.data.updateUserAddress.administrativeArea).toBe(
        addressInput.administrativeArea,
      );
      expect(result.body.data.updateUserAddress.postalCode).toBe(
        addressInput.postalCode,
      );
      expect(result.body.data.updateUserAddress.countryCode).toBe(
        addressInput.countryCode,
      );
      expect(result.body.data.updateUserAddress.instructions).toBe(
        addressInput.instructions,
      );
      expect(result.body.data.updateUserAddress.additionalNotes).toBe(
        addressInput.additionalNotes,
      );
      expect(result.body.data.updateUserAddress.type).toBe(addressInput.type);
    });

    it('should reject if user is not authenticated', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
        }),
      );
      const addressInput = updateUserAddressInputFactory.buildOne({
        organisationName: faker.company.companyName(),
        line1: faker.address.streetAddress(),
        line2: faker.address.secondaryAddress(),
        locality: faker.address.city(),
        administrativeArea: faker.address.state(),
        postalCode: faker.address.zipCode(),
        countryCode: faker.address.countryCode(),
      });

      const gqlReq = {
        query,
        variables: {
          id: address.id,
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe('Unauthorized');
    });

    it('should reject if user is not the owner of the address', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
        }),
      );
      const addressInput = updateUserAddressInputFactory.buildOne({
        organisationName: faker.company.companyName(),
        line1: faker.address.streetAddress(),
        line2: faker.address.secondaryAddress(),
        locality: faker.address.city(),
        administrativeArea: faker.address.state(),
        postalCode: faker.address.zipCode(),
        countryCode: faker.address.countryCode(),
      });

      const otherUser = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          id: faker.datatype.uuid(),
          email: faker.internet.email(),
        }),
      );
      const gqlReq = {
        query,
        variables: {
          id: address.id,
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(otherUser))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        `Unauthorized: Only the owner of this address can update it`,
      );
    });

    it('should reject if address does not exist', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const addressInput = updateUserAddressInputFactory.buildOne();

      const gqlReq = {
        query,
        variables: {
          id: faker.datatype.uuid(),
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        `User address with id ${gqlReq.variables.id} not found`,
      );
    });
  });
});
