import * as request from 'supertest';
import {
  productFactory,
  productVersionFactory,
} from '../../factories/product.factory';
import { gql } from 'apollo-server-express';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import { E2EApp, initializeApp } from '../test_utils/initialize_app';
import {
  productFeatureOptionPriceFactory,
  productPriceFactory,
} from 'test/factories/price.factory';
import * as faker from 'faker';
import {
  orderImageFactory,
  productImageFactory,
} from 'test/factories/image.factory';
import {
  productFeatureOptionFactory,
  productFeatureOptionVersionFactory,
} from 'test/factories/product_feature_option.factory';
import { productFeatureFactory } from 'test/factories/product_feature.factory';
import { userFactory } from 'test/factories/user.factory';
import { washerFactory } from 'test/factories/washer.factory';
import {
  addOrderAddressInputFactory,
  businessAddressFactory,
  orderAddressFactory,
  washerAddressFactory,
} from 'test/factories/address.factory';
import { addressInstructions } from 'src/server/common/scalars/address_instruction.scalar';
import {
  createUnconfirmedOrderInputFactory,
  CreateUnconfirmedOrderInputFactory,
  orderFactory,
} from 'test/factories/order.factory';
import { businessFactory } from 'test/factories/business.factory';
import { CreateUnconfirmedOrderInput } from 'src/server/app/orders/input/create_unconfirmed_order.input';

describe('OrderModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('createUnconfirmedOrder mutation', () => {
    const query = gql`
      query createUnconfirmedOrder($input: CreateUnconfirmedOrderInput!) {
        createUnconfirmedOrder(input: $input) {
          id
          orderNumber
          currencyCode
          quantity
          isExpressDelivery
          totalPriceInCents
          pickupDate
          pickupBetween
          deliveryDate
          deliverBetween
          status
          confirmedAt
          washerAssignedAt
          pickedUpAt
          readyForDeliveryAt
          onTheWayAt
          deliveredAt
          washerNotesOnPickup
          washerNotesOnDelivery
          additionalChargesInCents
          additionalChargeReason
          isCancelled
          cancellationReason
          cancelledAt
          pickupAddress {
            id
            line1
            line2
            locality
            administrativeArea
            postalCode
            countryCode
            organisationName
            instructions
            additionalNotes
            createdAt
            updatedAt
          }
          deliveryAddress {
            id
            line1
            line2
            locality
            administrativeArea
            postalCode
            countryCode
            organisationName
            instructions
            additionalNotes
            createdAt
            updatedAt
          }
          productVersion {
            id
            versionNumber
            basePrice {
              id
              isPerBag
              audInCents
              createdAt
              updatedAt
            }
            expressDeliveryPrice {
              id
              isPerBag
              audInCents
              createdAt
              updatedAt
            }
            product {
              id
              name
              description
              isAvailable
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
          washer {
            id
            status
            lastStatusChangeAt
            firstAbleToWorkAt
            language
            user {
              id
              email
              firstName
              lastName
              phoneCountryCode
              phoneNumber
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
          pickupImages {
            id
            name
            key
            createdAt
            updatedAt
          }
          readyForDeliveryImages {
            id
            name
            key
            createdAt
            updatedAt
          }
          deliveryImages {
            id
            name
            key
            createdAt
            updatedAt
          }
          preferences {
            id
            versionNumber
            price {
              id
              isPerBag
              audInCents
              createdAt
              updatedAt
            }
            productFeatureOption {
              id
              name
              description
              isDefault
              isAvailable
              productFeature {
                id
                name
                description
                isAvailable
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    `.loc?.source.body;

    it('should create and return unconfirmed order', async () => {
      // product feature and option
      const productFeature = await e2e.dbTestUtils.saveOne(
        productFeatureFactory.buildOne(),
      );
      const optionId = faker.datatype.uuid();
      const optionPrice = await e2e.dbTestUtils.saveOne(
        productFeatureOptionPriceFactory.buildOne(),
      );
      const option = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          id: optionId,
          productFeature: productFeature,
          versions: [],
        }),
      );
      const optionVersion = await e2e.dbTestUtils.saveOne(
        productFeatureOptionVersionFactory.buildOne({
          price: optionPrice,
          productFeatureOption: option,
        }),
      );

      // product
      const productId = faker.datatype.uuid();
      const image = await e2e.dbTestUtils.saveOne(
        productImageFactory.buildOne(),
      );
      const basePrice = await e2e.dbTestUtils.saveOne(
        productPriceFactory.buildOne({
          id: faker.datatype.uuid(),
        }),
      );
      const expressDeliveryPrice = await e2e.dbTestUtils.saveOne(
        productPriceFactory.buildOne({
          id: faker.datatype.uuid(),
        }),
      );
      const product = await e2e.dbTestUtils.saveOne(
        productFactory.buildOne({
          id: productId,
          image: image,
          features: [productFeature],
          versions: [],
        }),
      );
      const productVersion = await e2e.dbTestUtils.saveOne(
        productVersionFactory.buildOne({
          product: product,
          basePrice: basePrice,
          expressDeliveryPrice: expressDeliveryPrice,
        }),
      );

      // addresses
      const pickupAddressInput = addOrderAddressInputFactory.buildOne();
      const deliveryAddressInput = addOrderAddressInputFactory.buildOne({
        line1: faker.address.streetAddress(),
        line2: faker.address.streetAddress(),
        locality: faker.address.city(),
        administrativeArea: faker.address.state(),
        postalCode: faker.address.zipCode(),
        countryCode: faker.address.countryCode(),
        organisationName: faker.company.companyName(),
        instructions: faker.random.arrayElement(addressInstructions),
        additionalNotes: faker.lorem.sentence(),
      });

      // user
      const user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          id: faker.datatype.uuid(),
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );

      // input
      const input = createUnconfirmedOrderInputFactory.buildOne({
        pickupAddressInput,
        deliveryAddressInput,
        productVersionId: productVersion.id,
        preferenceIds: [optionId],
        isExpressDelivery: true,
      });

      // query
      const gqlReg = {
        query,
        variables: {
          input,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // order
      expect(result.body.data.order.id).toBe(order.id);
      expect(result.body.data.order.orderNumber).toBe(order.orderNumber);
      expect(result.body.data.order.currencyCode).toBe(order.currencyCode);
      expect(result.body.data.order.quantity).toBe(order.quantity);
      expect(result.body.data.order.isExpressDelivery).toBe(
        order.isExpressDelivery,
      );
      expect(result.body.data.order.totalPriceInCents).toBe(
        order.totalPriceInCents,
      );
      expect(result.body.data.order.pickupDate).toBe(
        order.pickupDate.toISOString(),
      );
      expect(result.body.data.order.pickupBetween).toBe(order.pickupBetween);
      expect(result.body.data.order.deliveryDate).toBe(
        order.deliveryDate.toISOString(),
      );
      expect(result.body.data.order.deliverBetween).toBe(order.deliverBetween);
      expect(result.body.data.order.status).toBe(order.status);
      expect(result.body.data.order.confirmedAt).toBe(
        order.confirmedAt.toISOString(),
      );
      expect(result.body.data.order.washerAssignedAt).toBe(
        order.washerAssignedAt.toISOString(),
      );
      expect(result.body.data.order.pickedUpAt).toBe(
        order.pickedUpAt.toISOString(),
      );
      expect(result.body.data.order.readyForDeliveryAt).toBe(
        order.readyForDeliveryAt.toISOString(),
      );
      expect(result.body.data.order.onTheWayAt).toBe(
        order.onTheWayAt.toISOString(),
      );
      expect(result.body.data.order.deliveredAt).toBe(
        order.deliveredAt.toISOString(),
      );
      expect(result.body.data.order.washerNotesOnPickup).toBe(
        order.washerNotesOnPickup,
      );
      expect(result.body.data.order.washerNotesOnDelivery).toBe(
        order.washerNotesOnDelivery,
      );
      expect(result.body.data.order.additionalChargesInCents).toBe(
        order.additionalChargesInCents,
      );
      expect(result.body.data.order.additionalChargeReason).toBe(
        order.additionalChargeReason,
      );
      expect(result.body.data.order.isCancelled).toBe(order.isCancelled);
      expect(result.body.data.order.cancellationReason).toBe(
        order.cancellationReason,
      );
      expect(result.body.data.order.cancelledAt).toBe(null);
      expect(result.body.data.order.createdAt).toBe(
        order.createdAt.toISOString(),
      );
      expect(result.body.data.order.updatedAt).toBe(
        order.updatedAt.toISOString(),
      );

      // pickup address
      expect(result.body.data.order.pickupAddress.id).toBe(pickupAddress.id);
      expect(result.body.data.order.pickupAddress.line1).toBe(
        pickupAddress.line1,
      );
      expect(result.body.data.order.pickupAddress.line2).toBe(
        pickupAddress.line2,
      );
      expect(result.body.data.order.pickupAddress.locality).toBe(
        pickupAddress.locality,
      );
      expect(result.body.data.order.pickupAddress.administrativeArea).toBe(
        pickupAddress.administrativeArea,
      );
      expect(result.body.data.order.pickupAddress.postalCode).toBe(
        pickupAddress.postalCode,
      );
      expect(result.body.data.order.pickupAddress.countryCode).toBe(
        pickupAddress.countryCode,
      );
      expect(result.body.data.order.pickupAddress.organisationName).toBe(
        pickupAddress.organisationName,
      );
      expect(result.body.data.order.pickupAddress.instructions).toBe(
        pickupAddress.instructions,
      );
      expect(result.body.data.order.pickupAddress.additionalNotes).toBe(
        pickupAddress.additionalNotes,
      );
      expect(result.body.data.order.pickupAddress.createdAt).toBe(
        pickupAddress.createdAt.toISOString(),
      );
      expect(result.body.data.order.pickupAddress.updatedAt).toBe(
        pickupAddress.updatedAt.toISOString(),
      );

      // delivery address
      expect(result.body.data.order.deliveryAddress.id).toBe(
        deliveryAddress.id,
      );
      expect(result.body.data.order.deliveryAddress.line1).toBe(
        deliveryAddress.line1,
      );
      expect(result.body.data.order.deliveryAddress.line2).toBe(
        deliveryAddress.line2,
      );
      expect(result.body.data.order.deliveryAddress.locality).toBe(
        deliveryAddress.locality,
      );
      expect(result.body.data.order.deliveryAddress.administrativeArea).toBe(
        deliveryAddress.administrativeArea,
      );
      expect(result.body.data.order.deliveryAddress.postalCode).toBe(
        deliveryAddress.postalCode,
      );
      expect(result.body.data.order.deliveryAddress.countryCode).toBe(
        deliveryAddress.countryCode,
      );
      expect(result.body.data.order.deliveryAddress.organisationName).toBe(
        deliveryAddress.organisationName,
      );
      expect(result.body.data.order.deliveryAddress.instructions).toBe(
        deliveryAddress.instructions,
      );
      expect(result.body.data.order.deliveryAddress.additionalNotes).toBe(
        deliveryAddress.additionalNotes,
      );
      expect(result.body.data.order.deliveryAddress.createdAt).toBe(
        deliveryAddress.createdAt.toISOString(),
      );
      expect(result.body.data.order.deliveryAddress.updatedAt).toBe(
        deliveryAddress.updatedAt.toISOString(),
      );

      // product version
      expect(result.body.data.order.productVersion.id).toBe(productVersion.id);
      expect(result.body.data.order.productVersion.versionNumber).toBe(
        productVersion.versionNumber,
      );
      expect(result.body.data.order.productVersion.createdAt).toBe(
        productVersion.createdAt.toISOString(),
      );
      expect(result.body.data.order.productVersion.updatedAt).toBe(
        productVersion.updatedAt.toISOString(),
      );

      // base price
      expect(result.body.data.order.productVersion.basePrice.id).toBe(
        basePrice.id,
      );
      expect(result.body.data.order.productVersion.basePrice.isPerBag).toBe(
        basePrice.isPerBag,
      );
      expect(result.body.data.order.productVersion.basePrice.audInCents).toBe(
        basePrice.audInCents,
      );
      expect(result.body.data.order.productVersion.basePrice.createdAt).toBe(
        basePrice.createdAt.toISOString(),
      );
      expect(result.body.data.order.productVersion.basePrice.updatedAt).toBe(
        basePrice.updatedAt.toISOString(),
      );

      // express delivery price
      expect(
        result.body.data.order.productVersion.expressDeliveryPrice.id,
      ).toBe(expressDeliveryPrice.id);
      expect(
        result.body.data.order.productVersion.expressDeliveryPrice.isPerBag,
      ).toBe(expressDeliveryPrice.isPerBag);
      expect(
        result.body.data.order.productVersion.expressDeliveryPrice.audInCents,
      ).toBe(expressDeliveryPrice.audInCents);
      expect(
        result.body.data.order.productVersion.expressDeliveryPrice.createdAt,
      ).toBe(expressDeliveryPrice.createdAt.toISOString());
      expect(
        result.body.data.order.productVersion.expressDeliveryPrice.updatedAt,
      ).toBe(expressDeliveryPrice.updatedAt.toISOString());

      // product
      expect(result.body.data.order.productVersion.product.id).toBe(product.id);
      expect(result.body.data.order.productVersion.product.name).toBe(
        product.name,
      );
      expect(result.body.data.order.productVersion.product.description).toBe(
        product.description,
      );
      expect(result.body.data.order.productVersion.product.isAvailable).toBe(
        product.isAvailable,
      );
      expect(result.body.data.order.productVersion.product.createdAt).toBe(
        product.createdAt.toISOString(),
      );
      expect(result.body.data.order.productVersion.product.updatedAt).toBe(
        product.updatedAt.toISOString(),
      );

      // washer
      expect(result.body.data.order.washer.id).toBe(washer.id);
      expect(result.body.data.order.washer.status).toBe(washer.status);
      expect(result.body.data.order.washer.lastStatusChangeAt).toBe(
        washer.lastStatusChangeAt.toISOString(),
      );
      expect(result.body.data.order.washer.lastStatusChangeAt).toBe(
        washer.lastStatusChangeAt.toISOString(),
      );
      expect(result.body.data.order.washer.firstAbleToWorkAt).toBe(
        washer.firstAbleToWorkAt.toISOString(),
      );
      expect(result.body.data.order.washer.language).toBe(washer.language);
      expect(result.body.data.order.washer.createdAt).toBe(
        washer.createdAt.toISOString(),
      );
      expect(result.body.data.order.washer.updatedAt).toBe(
        washer.updatedAt.toISOString(),
      );

      // washer user
      expect(result.body.data.order.washer.user.id).toBe(washerUser.id);
      expect(result.body.data.order.washer.user.firstName).toBe(
        washerUser.firstName,
      );
      expect(result.body.data.order.washer.user.lastName).toBe(
        washerUser.lastName,
      );
      expect(result.body.data.order.washer.user.email).toBe(washerUser.email);
      expect(result.body.data.order.washer.user.phoneCountryCode).toBe(
        washerUser.phoneCountryCode,
      );
      expect(result.body.data.order.washer.user.phoneNumber).toBe(
        washerUser.phoneNumber,
      );
      expect(result.body.data.order.washer.user.createdAt).toBe(
        washerUser.createdAt.toISOString(),
      );
      expect(result.body.data.order.washer.user.updatedAt).toBe(
        washerUser.updatedAt.toISOString(),
      );

      // pickup images
      expect(result.body.data.order.pickupImages.length).toBe(1);
      expect(result.body.data.order.pickupImages[0].id).toBe(pickupImage.id);
      expect(result.body.data.order.pickupImages[0].name).toBe(
        pickupImage.name,
      );
      expect(result.body.data.order.pickupImages[0].key).toBe(pickupImage.key);
      expect(result.body.data.order.pickupImages[0].createdAt).toBe(
        pickupImage.createdAt.toISOString(),
      );
      expect(result.body.data.order.pickupImages[0].updatedAt).toBe(
        pickupImage.updatedAt.toISOString(),
      );

      // ready for delivery images
      expect(result.body.data.order.readyForDeliveryImages.length).toBe(1);
      expect(result.body.data.order.readyForDeliveryImages[0].id).toBe(
        readyForDeliveryImage.id,
      );
      expect(result.body.data.order.readyForDeliveryImages[0].name).toBe(
        readyForDeliveryImage.name,
      );
      expect(result.body.data.order.readyForDeliveryImages[0].key).toBe(
        readyForDeliveryImage.key,
      );
      expect(result.body.data.order.readyForDeliveryImages[0].createdAt).toBe(
        readyForDeliveryImage.createdAt.toISOString(),
      );
      expect(result.body.data.order.readyForDeliveryImages[0].updatedAt).toBe(
        readyForDeliveryImage.updatedAt.toISOString(),
      );

      // delivery images
      expect(result.body.data.order.deliveryImages.length).toBe(1);
      expect(result.body.data.order.deliveryImages[0].id).toBe(
        deliveryImage.id,
      );
      expect(result.body.data.order.deliveryImages[0].name).toBe(
        deliveryImage.name,
      );
      expect(result.body.data.order.deliveryImages[0].key).toBe(
        deliveryImage.key,
      );
      expect(result.body.data.order.deliveryImages[0].createdAt).toBe(
        deliveryImage.createdAt.toISOString(),
      );
      expect(result.body.data.order.deliveryImages[0].updatedAt).toBe(
        deliveryImage.updatedAt.toISOString(),
      );

      // preferences
      expect(result.body.data.order.preferences.length).toBe(1);
      expect(result.body.data.order.preferences[0].id).toBe(optionVersion.id);
      expect(result.body.data.order.preferences[0].versionNumber).toBe(
        optionVersion.versionNumber,
      );

      // option price
      expect(result.body.data.order.preferences[0].price.id).toBe(
        optionPrice.id,
      );
      expect(result.body.data.order.preferences[0].price.isPerBag).toBe(
        optionPrice.isPerBag,
      );
      expect(result.body.data.order.preferences[0].price.audInCents).toBe(
        optionPrice.audInCents,
      );
      expect(result.body.data.order.preferences[0].price.createdAt).toBe(
        optionPrice.createdAt.toISOString(),
      );
      expect(result.body.data.order.preferences[0].price.updatedAt).toBe(
        optionPrice.updatedAt.toISOString(),
      );

      // option
      expect(
        result.body.data.order.preferences[0].productFeatureOption.id,
      ).toBe(option.id);
      expect(
        result.body.data.order.preferences[0].productFeatureOption.name,
      ).toBe(option.name);
      expect(
        result.body.data.order.preferences[0].productFeatureOption.description,
      ).toBe(option.description);
      expect(
        result.body.data.order.preferences[0].productFeatureOption.isDefault,
      ).toBe(option.isDefault);
      expect(
        result.body.data.order.preferences[0].productFeatureOption.isAvailable,
      ).toBe(option.isAvailable);
      expect(
        result.body.data.order.preferences[0].productFeatureOption.createdAt,
      ).toBe(option.createdAt.toISOString());
      expect(
        result.body.data.order.preferences[0].productFeatureOption.updatedAt,
      ).toBe(option.updatedAt.toISOString());

      // feature
      expect(
        result.body.data.order.preferences[0].productFeatureOption
          .productFeature.id,
      ).toBe(productFeature.id);
      expect(
        result.body.data.order.preferences[0].productFeatureOption
          .productFeature.name,
      ).toBe(productFeature.name);
      expect(
        result.body.data.order.preferences[0].productFeatureOption
          .productFeature.description,
      ).toBe(productFeature.description);
      expect(
        result.body.data.order.preferences[0].productFeatureOption
          .productFeature.isAvailable,
      ).toBe(productFeature.isAvailable);
      expect(
        result.body.data.order.preferences[0].productFeatureOption
          .productFeature.createdAt,
      ).toBe(productFeature.createdAt.toISOString());
      expect(
        result.body.data.order.preferences[0].productFeatureOption
          .productFeature.updatedAt,
      ).toBe(productFeature.updatedAt.toISOString());
    });

    it('should reject if user is not authenticated', async () => {
      const gqlReg = {
        query,
        variables: {
          id: faker.datatype.uuid(),
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe('Unauthorized');
    });

    it('should reject if order does not exist', async () => {
      const gqlReg = {
        query,
        variables: {
          id: faker.datatype.uuid(),
        },
      };

      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors[0].message).toBe(
        `Order with id ${gqlReg.variables.id} not found`,
      );
    });
  });
});
