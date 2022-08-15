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
          isSelectedPickup
          isSelectedDelivery
          user {
            id
            addresses {
              id
              isSelectedDelivery
              isSelectedPickup
            }
          }
        }
      }
    `.loc?.source.body;

    it('should add a PICKUP_AND_DELIVERY address with all fields', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        type: 'PICKUP_AND_DELIVERY',
      });
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // new address
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
      expect(addUserAddress.type).toEqual('PICKUP_AND_DELIVERY');
      expect(addUserAddress.isSelectedPickup).toEqual(true);
      expect(addUserAddress.isSelectedDelivery).toEqual(true);

      // user addresses
      expect(addUserAddress.user.id).toEqual(user.id);
      expect(addUserAddress.user.addresses[0].id).toEqual(prevAddressOne.id);
      expect(addUserAddress.user.addresses[0].isSelectedDelivery).toEqual(
        false,
      );
      expect(addUserAddress.user.addresses[0].isSelectedPickup).toEqual(false);
      expect(addUserAddress.user.addresses[1].id).toEqual(prevAddressTwo.id);
      expect(addUserAddress.user.addresses[1].isSelectedDelivery).toEqual(
        false,
      );
      expect(addUserAddress.user.addresses[1].isSelectedPickup).toEqual(false);
    });

    it('should add a PICKUP address with all fields', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        type: 'PICKUP',
      });
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // new address
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
      expect(addUserAddress.type).toEqual('PICKUP');
      expect(addUserAddress.isSelectedPickup).toEqual(true);
      expect(addUserAddress.isSelectedDelivery).toEqual(false);

      // user addresses
      expect(addUserAddress.user.id).toEqual(user.id);
      expect(addUserAddress.user.addresses[0].id).toEqual(prevAddressOne.id);
      expect(addUserAddress.user.addresses[0].isSelectedDelivery).toEqual(true);
      expect(addUserAddress.user.addresses[0].isSelectedPickup).toEqual(false);
      expect(addUserAddress.user.addresses[1].id).toEqual(prevAddressTwo.id);
      expect(addUserAddress.user.addresses[1].isSelectedDelivery).toEqual(
        false,
      );
      expect(addUserAddress.user.addresses[1].isSelectedPickup).toEqual(false);
    });

    it('should add a DELIVERY address with all fields', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        type: 'DELIVERY',
      });
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // new address
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
      expect(addUserAddress.type).toEqual('DELIVERY');
      expect(addUserAddress.isSelectedPickup).toEqual(false);
      expect(addUserAddress.isSelectedDelivery).toEqual(true);

      // user addresses
      expect(addUserAddress.user.id).toEqual(user.id);
      expect(addUserAddress.user.addresses[0].id).toEqual(prevAddressOne.id);
      expect(addUserAddress.user.addresses[0].isSelectedDelivery).toEqual(
        false,
      );
      expect(addUserAddress.user.addresses[0].isSelectedPickup).toEqual(false);
      expect(addUserAddress.user.addresses[1].id).toEqual(prevAddressTwo.id);
      expect(addUserAddress.user.addresses[1].isSelectedDelivery).toEqual(
        false,
      );
      expect(addUserAddress.user.addresses[1].isSelectedPickup).toEqual(true);
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

    it('should reject if required fields are missing', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        line1: null,
        locality: null,
        administrativeArea: null,
        postalCode: null,
        countryCode: null,
        instructions: null,
        type: null,
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
        .expect(400);

      expect(result.body.errors).toHaveLength(7);
      expect(result.body.errors[0].message).toEqual(
        'Variable "$input" got invalid value null at "input.line1"; Expected non-nullable type "String!" not to be null.',
      );
      expect(result.body.errors[1].message).toEqual(
        'Variable "$input" got invalid value null at "input.locality"; Expected non-nullable type "String!" not to be null.',
      );
      expect(result.body.errors[2].message).toEqual(
        'Variable "$input" got invalid value null at "input.administrativeArea"; Expected non-nullable type "String!" not to be null.',
      );
      expect(result.body.errors[3].message).toEqual(
        'Variable "$input" got invalid value null at "input.postalCode"; Expected non-nullable type "String!" not to be null.',
      );
      expect(result.body.errors[4].message).toEqual(
        'Variable "$input" got invalid value null at "input.countryCode"; Expected non-nullable type "String!" not to be null.',
      );
      expect(result.body.errors[5].message).toEqual(
        'Variable "$input" got invalid value null at "input.instructions"; Expected non-nullable type "AddressInstructionScalar!" not to be null.',
      );
      expect(result.body.errors[6].message).toEqual(
        'Variable "$input" got invalid value null at "input.type"; Expected non-nullable type "AddressTypeScalar!" not to be null.',
      );
    });

    it('should reject if fields are invalid', async () => {
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        line1: 'x'.repeat(256),
        locality: 'x'.repeat(256),
        administrativeArea: 'x'.repeat(256),
        postalCode: 'x'.repeat(256),
        countryCode: 'x'.repeat(256),
        organisationName: 'x'.repeat(256),
        additionalNotes: 'x'.repeat(1201),
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

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'organisationName must be shorter than or equal to 255 characters, additionalNotes must be shorter than or equal to 1200 characters, line1 must be shorter than or equal to 255 characters, locality must be shorter than or equal to 255 characters, administrativeArea must be shorter than or equal to 255 characters, postalCode must be shorter than or equal to 255 characters, countryCode must be a valid ISO31661 Alpha2 code',
      );
    });

    it('should reject if duplicate address is added', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddress = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP_AND_DELIVERY',
          isSelectedPickup: true,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddress],
        }),
      );
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        line1: prevAddress.line1,
        line2: prevAddress.line2,
        locality: prevAddress.locality,
        administrativeArea: prevAddress.administrativeArea,
        postalCode: prevAddress.postalCode,
        countryCode: prevAddress.countryCode,
        organisationName: prevAddress.organisationName,
        instructions: prevAddress.instructions,
        type: prevAddress.type,
      });

      const gqlReq = {
        query,
        variables: {
          input: addUserAddressInput,
        },
      };

      await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        `Address already exists: ${prevAddress.line1} ${prevAddress.line2}, ${prevAddress.locality} ${prevAddress.postalCode} ${prevAddress.administrativeArea} ${prevAddress.countryCode}`,
      );
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
          isSelectedDelivery
          isSelectedPickup
          user {
            id
            addresses {
              id
              isSelectedDelivery
              isSelectedPickup
            }
          }
        }
      }
    `.loc?.source.body;

    it('should update a user address to PICKUP_AND_DELIVERY', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );
      const addressInput = updateUserAddressInputFactory.buildOne({
        type: 'PICKUP_AND_DELIVERY',
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
          id: prevAddressOne.id,
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // new address
      expect(result.body.data.updateUserAddress.id).toBe(prevAddressOne.id);
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
      expect(result.body.data.updateUserAddress.type).toBe(
        'PICKUP_AND_DELIVERY',
      );
      expect(result.body.data.updateUserAddress.isSelectedDelivery).toBe(true);
      expect(result.body.data.updateUserAddress.isSelectedPickup).toBe(true);

      // other user addresses
      expect(result.body.data.updateUserAddress.user.id).toBe(user.id);
      expect(result.body.data.updateUserAddress.user.addresses).toHaveLength(2);
      expect(result.body.data.updateUserAddress.user.addresses[1].id).toBe(
        prevAddressTwo.id,
      );
      expect(
        result.body.data.updateUserAddress.user.addresses[1].isSelectedDelivery,
      ).toBe(false);
      expect(
        result.body.data.updateUserAddress.user.addresses[1].isSelectedPickup,
      ).toBe(false);
    });

    it('should update a user address to PICKUP', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );
      const addressInput = updateUserAddressInputFactory.buildOne({
        type: 'PICKUP',
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
          id: prevAddressOne.id,
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // new address
      expect(result.body.data.updateUserAddress.id).toBe(prevAddressOne.id);
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
      expect(result.body.data.updateUserAddress.type).toBe('PICKUP');
      expect(result.body.data.updateUserAddress.isSelectedDelivery).toBe(false);
      expect(result.body.data.updateUserAddress.isSelectedPickup).toBe(true);

      // other user addresses
      expect(result.body.data.updateUserAddress.user.id).toBe(user.id);
      expect(result.body.data.updateUserAddress.user.addresses).toHaveLength(2);
      expect(result.body.data.updateUserAddress.user.addresses[1].id).toBe(
        prevAddressTwo.id,
      );
      expect(
        result.body.data.updateUserAddress.user.addresses[1].isSelectedDelivery,
      ).toBe(false);
      expect(
        result.body.data.updateUserAddress.user.addresses[1].isSelectedPickup,
      ).toBe(false);
    });

    it('should update a user address to DELIVERY', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP_AND_DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );
      const addressInput = updateUserAddressInputFactory.buildOne({
        type: 'DELIVERY',
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
          id: prevAddressOne.id,
          input: addressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // new address
      expect(result.body.data.updateUserAddress.id).toBe(prevAddressOne.id);
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
      expect(result.body.data.updateUserAddress.type).toBe('DELIVERY');
      expect(result.body.data.updateUserAddress.isSelectedDelivery).toBe(true);
      expect(result.body.data.updateUserAddress.isSelectedPickup).toBe(false);

      // other user addresses
      expect(result.body.data.updateUserAddress.user.id).toBe(user.id);
      expect(result.body.data.updateUserAddress.user.addresses).toHaveLength(2);
      expect(result.body.data.updateUserAddress.user.addresses[1].id).toBe(
        prevAddressTwo.id,
      );
      expect(
        result.body.data.updateUserAddress.user.addresses[1].isSelectedDelivery,
      ).toBe(false);
      expect(
        result.body.data.updateUserAddress.user.addresses[1].isSelectedPickup,
      ).toBe(false);
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

    it('should reject if fields are invalid', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddress = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddress],
        }),
      );
      const updateUserAddressInput = updateUserAddressInputFactory.buildOne({
        line1: 'x'.repeat(256),
        locality: 'x'.repeat(256),
        administrativeArea: 'x'.repeat(256),
        postalCode: 'x'.repeat(256),
        countryCode: 'x'.repeat(256),
        organisationName: 'x'.repeat(256),
        additionalNotes: 'x'.repeat(1201),
      });

      const gqlReq = {
        query,
        variables: {
          id: prevAddress.id,
          input: updateUserAddressInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        'organisationName must be shorter than or equal to 255 characters, additionalNotes must be shorter than or equal to 1200 characters, line1 must be shorter than or equal to 255 characters, locality must be shorter than or equal to 255 characters, administrativeArea must be shorter than or equal to 255 characters, postalCode must be shorter than or equal to 255 characters, countryCode must be a valid ISO31661 Alpha2 code',
      );
    });

    it('should reject if address is updated to a duplicate address', async () => {
      let user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const prevAddressOne = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'DELIVERY',
          isSelectedPickup: false,
          isSelectedDelivery: true,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      const prevAddressTwo = await e2e.dbTestUtils.saveOne(
        userAddressFactory.buildOne({
          user,
          type: 'PICKUP',
          isSelectedPickup: true,
          isSelectedDelivery: false,
          organisationName: faker.company.companyName(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          locality: faker.address.city(),
          administrativeArea: faker.address.state(),
          postalCode: faker.address.zipCode(),
          countryCode: faker.address.countryCode(),
        }),
      );
      user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...user,
          addresses: [prevAddressOne, prevAddressTwo],
        }),
      );
      const updateUserAddressInput = updateUserAddressInputFactory.buildOne({
        line1: prevAddressOne.line1,
        line2: prevAddressOne.line2,
        locality: prevAddressOne.locality,
        administrativeArea: prevAddressOne.administrativeArea,
        postalCode: prevAddressOne.postalCode,
        countryCode: prevAddressOne.countryCode,
        organisationName: prevAddressOne.organisationName,
        instructions: prevAddressOne.instructions,
        type: prevAddressOne.type,
      });

      const gqlReq = {
        query,
        variables: {
          id: prevAddressTwo.id,
          input: updateUserAddressInput,
        },
      };

      await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toEqual(
        `Address already exists: ${prevAddressOne.line1} ${prevAddressOne.line2}, ${prevAddressOne.locality} ${prevAddressOne.postalCode} ${prevAddressOne.administrativeArea} ${prevAddressOne.countryCode}`,
      );
    });
  });
});
