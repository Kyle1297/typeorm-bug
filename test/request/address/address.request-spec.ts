import { E2EApp, initializeApp } from '../test-utils/initialize-app';
import { gql } from 'apollo-server-express';
import { userFactory } from '../../factories/user.factory';
import * as request from 'supertest';
import * as faker from 'faker';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import {
  addAddressInputFactory,
  addressFactory,
} from 'test/factories/address.factory';
import { User } from 'src/server/app/users/user.entity';
import { AddAddressInput } from '../../../src/server/app/addresses/input/add-address.input';

describe('AddressModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('addAddress mutation', () => {
    const query = gql`
      mutation addAddress($input: AddAddressInput!) {
        addAddress(input: $input) {
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
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP_AND_DELIVERY',
      });
      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const addAddress = result.body.data.addAddress;
      expect(addAddress.organisationName).toEqual(
        addAddressInput.organisationName,
      );
      expect(addAddress.line1).toEqual(addAddressInput.line1);
      expect(addAddress.line2).toEqual(addAddressInput.line2);
      expect(addAddress.locality).toEqual(addAddressInput.locality);
      expect(addAddress.administrativeArea).toEqual(
        addAddressInput.administrativeArea,
      );
      expect(addAddress.postalCode).toEqual(addAddressInput.postalCode);
      expect(addAddress.countryCode).toEqual(addAddressInput.countryCode);
      expect(addAddress.instructions).toEqual(addAddressInput.instructions);
      expect(addAddress.additionalNotes).toEqual(
        addAddressInput.additionalNotes,
      );
      expect(addAddress.type).toEqual(addAddressInput.type);
    });

    it('should add a valid address with only required fields', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP_AND_DELIVERY',
        line2: undefined,
        organisationName: undefined,
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const addAddress = result.body.data.addAddress;
      expect(addAddress.organisationName).toEqual('');
      expect(addAddress.line1).toEqual(addAddressInput.line1);
      expect(addAddress.line2).toEqual('');
      expect(addAddress.locality).toEqual(addAddressInput.locality);
      expect(addAddress.administrativeArea).toEqual(
        addAddressInput.administrativeArea,
      );
      expect(addAddress.postalCode).toEqual(addAddressInput.postalCode);
      expect(addAddress.countryCode).toEqual(addAddressInput.countryCode);
      expect(addAddress.instructions).toEqual(addAddressInput.instructions);
      expect(addAddress.additionalNotes).toEqual(
        addAddressInput.additionalNotes,
      );
      expect(addAddress.type).toEqual(addAddressInput.type);
    });

    it('should add a valid business address', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'NOT_APPLICABLE',
        type: 'BUSINESS',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const addAddress = result.body.data.addAddress;
      expect(addAddress.organisationName).toEqual(
        addAddressInput.organisationName,
      );
      expect(addAddress.line1).toEqual(addAddressInput.line1);
      expect(addAddress.line2).toEqual(addAddressInput.line2);
      expect(addAddress.locality).toEqual(addAddressInput.locality);
      expect(addAddress.administrativeArea).toEqual(
        addAddressInput.administrativeArea,
      );
      expect(addAddress.postalCode).toEqual(addAddressInput.postalCode);
      expect(addAddress.countryCode).toEqual(addAddressInput.countryCode);
      expect(addAddress.instructions).toEqual(addAddressInput.instructions);
      expect(addAddress.additionalNotes).toEqual(
        addAddressInput.additionalNotes,
      );
      expect(addAddress.type).toEqual(addAddressInput.type);
    });

    it('should add a valid washing address', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'NOT_APPLICABLE',
        type: 'WASHING',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const addAddress = result.body.data.addAddress;
      expect(addAddress.organisationName).toEqual(
        addAddressInput.organisationName,
      );
      expect(addAddress.line1).toEqual(addAddressInput.line1);
      expect(addAddress.line2).toEqual(addAddressInput.line2);
      expect(addAddress.locality).toEqual(addAddressInput.locality);
      expect(addAddress.administrativeArea).toEqual(
        addAddressInput.administrativeArea,
      );
      expect(addAddress.postalCode).toEqual(addAddressInput.postalCode);
      expect(addAddress.countryCode).toEqual(addAddressInput.countryCode);
      expect(addAddress.instructions).toEqual(addAddressInput.instructions);
      expect(addAddress.additionalNotes).toEqual(
        addAddressInput.additionalNotes,
      );
      expect(addAddress.type).toEqual(addAddressInput.type);
    });

    it('should reject business address with LEAVE_AT_DOOR instructions', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'BUSINESS',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Business or washing addresses cannot have instructions',
      );
    });

    it('should reject business address with MEET_AT_DOOR instructions', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'MEET_AT_DOOR',
        type: 'BUSINESS',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Business or washing addresses cannot have instructions',
      );
    });

    it('should reject business address with MEET_OUTSIDE instructions', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'MEET_OUTSIDE',
        type: 'BUSINESS',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Business or washing addresses cannot have instructions',
      );
    });

    it('should reject washing address with LEAVE_AT_DOOR instructions', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'WASHING',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Business or washing addresses cannot have instructions',
      );
    });

    it('should reject washing address with MEET_AT_DOOR instructions', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'MEET_AT_DOOR',
        type: 'WASHING',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Business or washing addresses cannot have instructions',
      );
    });

    it('should reject washing address with MEET_OUTSIDE instructions', async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'MEET_OUTSIDE',
        type: 'WASHING',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Business or washing addresses cannot have instructions',
      );
    });

    it("should reject customer's PICKUP_AND_DELIVERY address with NOT_APPLICABLE instructions", async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'NOT_APPLICABLE',
        type: 'PICKUP_AND_DELIVERY',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Customer addresses must have instructions',
      );
    });

    it("should reject customer's PICKUP address with NOT_APPLICABLE instructions", async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'NOT_APPLICABLE',
        type: 'PICKUP',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Customer addresses must have instructions',
      );
    });

    it("should reject customer's DELIVERY address with NOT_APPLICABLE instructions", async () => {
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'NOT_APPLICABLE',
        type: 'DELIVERY',
      });

      const gqlReq = {
        query,
        variables: {
          input: addAddressInput,
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'Invalid parameter: Customer addresses must have instructions',
      );
    });

    it('should reject when user is not authenticated', async () => {
      const addAddressInput = addAddressInputFactory.buildOne();
      const gqlReq = {
        query,
        variables: {
          input: {
            ...addAddressInput,
            instructions: 'LEAVE_AT_DOOR',
            type: 'PICKUP_AND_DELIVERY',
          },
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

  describe('removeAddress mutation', () => {
    const query = gql`
      mutation remove($input: ID!) {
        removeAddress(id: $input) {
          line1
        }
      }
    `.loc?.source.body;

    it('should remove user, and return removed user', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        addressFactory.buildOne({
          entityId: user.id,
          entityType: User.name,
          instructions: 'LEAVE_AT_DOOR',
          type: 'PICKUP',
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

      expect(result.body.data.removeAddress.line1).toBe(address.line1);
    });

    it('should reject if user is not authenticated', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const address = await e2e.dbTestUtils.saveOne(
        addressFactory.buildOne({
          entityId: user.id,
          entityType: User.name,
          instructions: 'LEAVE_AT_DOOR',
          type: 'PICKUP',
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
        addressFactory.buildOne({
          entityId: user.id,
          entityType: User.name,
          instructions: 'LEAVE_AT_DOOR',
          type: 'PICKUP',
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
        `Unauthorized: Address does not belong to User with id ${otherUser.id}`,
      );
    });
  });
});
