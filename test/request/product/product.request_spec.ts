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
import { productImageFactory } from 'test/factories/image.factory';
import {
  productFeatureOptionFactory,
  productFeatureOptionVersionFactory,
} from 'test/factories/product_feature_option.factory';
import { productFeatureFactory } from 'test/factories/product_feature.factory';
import { userFactory } from 'test/factories/user.factory';

describe('ProductModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('product query', () => {
    const query = gql`
      query product($id: ID!) {
        product(id: $id) {
          id
          name
          description
          isAvailable
          image {
            id
            name
            key
            createdAt
            updatedAt
          }
          latestVersion {
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
            createdAt
            updatedAt
          }
          features {
            id
            name
            description
            isAvailable
            options {
              id
              name
              description
              isDefault
              isAvailable
              latestVersion {
                id
                versionNumber
                price {
                  id
                  isPerBag
                  audInCents
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
          createdAt
          updatedAt
        }
      }
    `.loc?.source.body;

    it('should return product', async () => {
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
          versionNumber: 1,
        }),
      );

      // query
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const gqlReg = {
        query,
        variables: {
          id: product.id,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // image
      expect(result.body.data.product.image.id).toBe(image.id);
      expect(result.body.data.product.image.name).toBe(image.name);
      expect(result.body.data.product.image.key).toBe(image.key);
      expect(result.body.data.product.image.createdAt).toBe(
        image.createdAt.toISOString(),
      );
      expect(result.body.data.product.image.updatedAt).toBe(
        image.updatedAt.toISOString(),
      );

      // product
      expect(result.body.data.product.id).toBe(product.id);
      expect(result.body.data.product.name).toBe(product.name);
      expect(result.body.data.product.description).toBe(product.description);
      expect(result.body.data.product.isAvailable).toBe(product.isAvailable);
      expect(result.body.data.product.createdAt).toBe(
        product.createdAt.toISOString(),
      );
      expect(result.body.data.product.updatedAt).toBe(
        product.updatedAt.toISOString(),
      );

      // product version
      expect(result.body.data.product.latestVersion.id).toBe(productVersion.id);
      expect(result.body.data.product.latestVersion.versionNumber).toBe(
        productVersion.versionNumber,
      );
      expect(result.body.data.product.latestVersion.createdAt).toBe(
        productVersion.createdAt.toISOString(),
      );
      expect(result.body.data.product.latestVersion.updatedAt).toBe(
        productVersion.updatedAt.toISOString(),
      );

      // base price
      expect(result.body.data.product.latestVersion.basePrice.id).toBe(
        basePrice.id,
      );
      expect(result.body.data.product.latestVersion.basePrice.isPerBag).toBe(
        basePrice.isPerBag,
      );
      expect(result.body.data.product.latestVersion.basePrice.audInCents).toBe(
        basePrice.audInCents,
      );
      expect(result.body.data.product.latestVersion.basePrice.createdAt).toBe(
        basePrice.createdAt.toISOString(),
      );
      expect(result.body.data.product.latestVersion.basePrice.updatedAt).toBe(
        basePrice.updatedAt.toISOString(),
      );

      // express delivery price
      expect(
        result.body.data.product.latestVersion.expressDeliveryPrice.id,
      ).toBe(expressDeliveryPrice.id);
      expect(
        result.body.data.product.latestVersion.expressDeliveryPrice.isPerBag,
      ).toBe(expressDeliveryPrice.isPerBag);
      expect(
        result.body.data.product.latestVersion.expressDeliveryPrice.audInCents,
      ).toBe(expressDeliveryPrice.audInCents);
      expect(
        result.body.data.product.latestVersion.expressDeliveryPrice.createdAt,
      ).toBe(expressDeliveryPrice.createdAt.toISOString());
      expect(
        result.body.data.product.latestVersion.expressDeliveryPrice.updatedAt,
      ).toBe(expressDeliveryPrice.updatedAt.toISOString());

      // features
      expect(result.body.data.product.features.length).toBe(1);
      expect(result.body.data.product.features[0].id).toBe(productFeature.id);
      expect(result.body.data.product.features[0].name).toBe(
        productFeature.name,
      );
      expect(result.body.data.product.features[0].description).toBe(
        productFeature.description,
      );
      expect(result.body.data.product.features[0].isAvailable).toBe(
        productFeature.isAvailable,
      );
      expect(result.body.data.product.features[0].createdAt).toBe(
        productFeature.createdAt.toISOString(),
      );
      expect(result.body.data.product.features[0].updatedAt).toBe(
        productFeature.updatedAt.toISOString(),
      );

      // feature options
      expect(result.body.data.product.features[0].options.length).toBe(1);
      expect(result.body.data.product.features[0].options[0].id).toBe(
        option.id,
      );
      expect(result.body.data.product.features[0].options[0].name).toBe(
        option.name,
      );
      expect(result.body.data.product.features[0].options[0].description).toBe(
        option.description,
      );
      expect(result.body.data.product.features[0].options[0].isDefault).toBe(
        option.isDefault,
      );
      expect(result.body.data.product.features[0].options[0].isAvailable).toBe(
        option.isAvailable,
      );
      expect(result.body.data.product.features[0].options[0].createdAt).toBe(
        option.createdAt.toISOString(),
      );
      expect(result.body.data.product.features[0].options[0].updatedAt).toBe(
        option.updatedAt.toISOString(),
      );

      // feature option versions
      expect(
        result.body.data.product.features[0].options[0].latestVersion.id,
      ).toBe(optionVersion.id);
      expect(
        result.body.data.product.features[0].options[0].latestVersion
          .versionNumber,
      ).toBe(optionVersion.versionNumber);
      expect(
        result.body.data.product.features[0].options[0].latestVersion.createdAt,
      ).toBe(optionVersion.createdAt.toISOString());
      expect(
        result.body.data.product.features[0].options[0].latestVersion.updatedAt,
      ).toBe(optionVersion.updatedAt.toISOString());

      // option price
      expect(
        result.body.data.product.features[0].options[0].latestVersion.price.id,
      ).toBe(optionPrice.id);
      expect(
        result.body.data.product.features[0].options[0].latestVersion.price
          .isPerBag,
      ).toBe(optionPrice.isPerBag);
      expect(
        result.body.data.product.features[0].options[0].latestVersion.price
          .audInCents,
      ).toBe(optionPrice.audInCents);
      expect(
        result.body.data.product.features[0].options[0].latestVersion.price
          .createdAt,
      ).toBe(optionPrice.createdAt.toISOString());
      expect(
        result.body.data.product.features[0].options[0].latestVersion.price
          .updatedAt,
      ).toBe(optionPrice.updatedAt.toISOString());
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
  });

  describe('products query', () => {
    const query = gql`
      query products {
        products {
          id
          name
          description
          isAvailable
          image {
            id
            name
            key
            createdAt
            updatedAt
          }
          latestVersion {
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
            createdAt
            updatedAt
          }
          features {
            id
            name
            description
            isAvailable
            options {
              id
              name
              description
              isDefault
              isAvailable
              latestVersion {
                id
                versionNumber
                price {
                  id
                  isPerBag
                  audInCents
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
          createdAt
          updatedAt
        }
      }
    `.loc?.source.body;

    it('should return products', async () => {
      // product feature one and two options
      const productFeatureOne = await e2e.dbTestUtils.saveOne(
        productFeatureFactory.buildOne(),
      );
      const optionOneId = faker.datatype.uuid();
      const optionOnePrice = await e2e.dbTestUtils.saveOne(
        productFeatureOptionPriceFactory.buildOne({
          id: faker.datatype.uuid(),
        }),
      );
      const optionOne = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          id: optionOneId,
          productFeature: productFeatureOne,
          versions: [],
        }),
      );
      const optionOneVersion = await e2e.dbTestUtils.saveOne(
        productFeatureOptionVersionFactory.buildOne({
          id: faker.datatype.uuid(),
          productFeatureOption: optionOne,
          price: optionOnePrice,
        }),
      );
      const optionTwoId = faker.datatype.uuid();
      const optionTwo = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          id: optionTwoId,
          productFeature: productFeatureOne,
          name: 'Option Two',
          description: 'Option Two Description',
          isDefault: false,
          isAvailable: true,
          versions: [],
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const optionTwoVersion = await e2e.dbTestUtils.saveOne(
        productFeatureOptionVersionFactory.buildOne({
          id: faker.datatype.uuid(),
          productFeatureOption: optionTwo,
          price: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );

      // product feature two and one option
      const productFeatureTwo = await e2e.dbTestUtils.saveOne(
        productFeatureFactory.buildOne({
          id: faker.datatype.uuid(),
          name: 'Feature Two',
          description: 'Feature Two Description',
          isAvailable: true,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const optionThreeId = faker.datatype.uuid();
      const optionThreePrice = await e2e.dbTestUtils.saveOne(
        productFeatureOptionPriceFactory.buildOne({
          isPerBag: true,
          audInCents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const optionThree = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          id: optionThreeId,
          productFeature: productFeatureTwo,
          name: 'Option Three',
          description: 'Option Three Description',
          isDefault: true,
          isAvailable: true,
          versions: [],
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const optionThreeVersion = await e2e.dbTestUtils.saveOne(
        productFeatureOptionVersionFactory.buildOne({
          id: faker.datatype.uuid(),
          productFeatureOption: optionThree,
          price: optionThreePrice,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );

      // product one
      const productOneId = faker.datatype.uuid();
      const imageOne = await e2e.dbTestUtils.saveOne(
        productImageFactory.buildOne(),
      );
      const productOneBasePrice = await e2e.dbTestUtils.saveOne(
        productPriceFactory.buildOne({
          id: faker.datatype.uuid(),
          isPerBag: true,
          audInCents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productOneExpressDeliveryPrice = await e2e.dbTestUtils.saveOne(
        productPriceFactory.buildOne({
          id: faker.datatype.uuid(),
          isPerBag: true,
          audInCents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productOne = await e2e.dbTestUtils.saveOne(
        productFactory.buildOne({
          id: productOneId,
          image: imageOne,
          features: [productFeatureOne, productFeatureTwo],
          versions: [],
        }),
      );
      const productOneVersion = await e2e.dbTestUtils.saveOne(
        productVersionFactory.buildOne({
          id: faker.datatype.uuid(),
          product: productOne,
          basePrice: productOneBasePrice,
          expressDeliveryPrice: productOneExpressDeliveryPrice,
        }),
      );

      // product two
      const productTwoId = faker.datatype.uuid();
      const imageTwo = await e2e.dbTestUtils.saveOne(
        productImageFactory.buildOne({
          key: faker.random.word(),
          name: faker.random.word(),
          id: faker.datatype.uuid(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productTwoBasePrice = await e2e.dbTestUtils.saveOne(
        productPriceFactory.buildOne({
          id: faker.datatype.uuid(),
          isPerBag: true,
          audInCents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productTwoExpressDeliveryPrice = await e2e.dbTestUtils.saveOne(
        productPriceFactory.buildOne({
          id: faker.datatype.uuid(),
          isPerBag: true,
          audInCents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productTwo = await e2e.dbTestUtils.saveOne(
        productFactory.buildOne({
          id: productTwoId,
          image: imageTwo,
          features: [productFeatureTwo],
          versions: [],
          name: 'Product Two',
          description: 'Product Two Description',
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productTwoVersion = await e2e.dbTestUtils.saveOne(
        productVersionFactory.buildOne({
          id: faker.datatype.uuid(),
          product: productTwo,
          basePrice: productTwoBasePrice,
          expressDeliveryPrice: productTwoExpressDeliveryPrice,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );

      // query
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      const gqlReg = {
        query,
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      // product one
      expect(result.body.data.products[0].id).toBe(productOne.id);
      expect(result.body.data.products[0].name).toBe(productOne.name);
      expect(result.body.data.products[0].description).toBe(
        productOne.description,
      );
      expect(result.body.data.products[0].isAvailable).toBe(
        productOne.isAvailable,
      );
      expect(result.body.data.products[0].createdAt).toBe(
        productOne.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].updatedAt).toBe(
        productOne.updatedAt.toISOString(),
      );

      // image for product one
      expect(result.body.data.products[0].image.id).toBe(imageOne.id);
      expect(result.body.data.products[0].image.name).toBe(imageOne.name);
      expect(result.body.data.products[0].image.key).toBe(imageOne.key);
      expect(result.body.data.products[0].image.createdAt).toBe(
        imageOne.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].image.updatedAt).toBe(
        imageOne.updatedAt.toISOString(),
      );

      // product one version
      expect(result.body.data.products[0].latestVersion.id).toBe(
        productOneVersion.id,
      );
      expect(result.body.data.products[0].latestVersion.versionNumber).toBe(
        productOneVersion.versionNumber,
      );
      expect(result.body.data.products[0].latestVersion.createdAt).toBe(
        productOneVersion.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].latestVersion.updatedAt).toBe(
        productOneVersion.updatedAt.toISOString(),
      );

      // product base price for product one
      expect(result.body.data.products[0].latestVersion.basePrice.id).toBe(
        productOneBasePrice.id,
      );
      expect(
        result.body.data.products[0].latestVersion.basePrice.isPerBag,
      ).toBe(productOneBasePrice.isPerBag);
      expect(
        result.body.data.products[0].latestVersion.basePrice.audInCents,
      ).toBe(productOneBasePrice.audInCents);
      expect(
        result.body.data.products[0].latestVersion.basePrice.createdAt,
      ).toBe(productOneBasePrice.createdAt.toISOString());
      expect(
        result.body.data.products[0].latestVersion.basePrice.updatedAt,
      ).toBe(productOneBasePrice.updatedAt.toISOString());

      // product express delivery price for product one
      expect(
        result.body.data.products[0].latestVersion.expressDeliveryPrice.id,
      ).toBe(productOneExpressDeliveryPrice.id);
      expect(
        result.body.data.products[0].latestVersion.expressDeliveryPrice
          .isPerBag,
      ).toBe(productOneExpressDeliveryPrice.isPerBag);
      expect(
        result.body.data.products[0].latestVersion.expressDeliveryPrice
          .audInCents,
      ).toBe(productOneExpressDeliveryPrice.audInCents);
      expect(
        result.body.data.products[0].latestVersion.expressDeliveryPrice
          .createdAt,
      ).toBe(productOneExpressDeliveryPrice.createdAt.toISOString());
      expect(
        result.body.data.products[0].latestVersion.expressDeliveryPrice
          .updatedAt,
      ).toBe(productOneExpressDeliveryPrice.updatedAt.toISOString());

      // feature one for product one
      expect(result.body.data.products[0].features.length).toBe(2);
      expect(result.body.data.products[0].features[0].id).toBe(
        productFeatureOne.id,
      );
      expect(result.body.data.products[0].features[0].name).toBe(
        productFeatureOne.name,
      );
      expect(result.body.data.products[0].features[0].description).toBe(
        productFeatureOne.description,
      );
      expect(result.body.data.products[0].features[0].isAvailable).toBe(
        productFeatureOne.isAvailable,
      );
      expect(result.body.data.products[0].features[0].createdAt).toBe(
        productFeatureOne.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].features[0].updatedAt).toBe(
        productFeatureOne.updatedAt.toISOString(),
      );

      // feature option one for feature one for product one
      expect(result.body.data.products[0].features[0].options.length).toBe(2);
      expect(result.body.data.products[0].features[0].options[1].id).toBe(
        optionOne.id,
      );
      expect(result.body.data.products[0].features[0].options[1].name).toBe(
        optionOne.name,
      );
      expect(
        result.body.data.products[0].features[0].options[1].description,
      ).toBe(optionOne.description);
      expect(
        result.body.data.products[0].features[0].options[1].isDefault,
      ).toBe(optionOne.isDefault);
      expect(
        result.body.data.products[0].features[0].options[1].isAvailable,
      ).toBe(optionOne.isAvailable);
      expect(
        result.body.data.products[0].features[0].options[1].createdAt,
      ).toBe(optionOne.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[1].updatedAt,
      ).toBe(optionOne.updatedAt.toISOString());

      // feature option version one for feature option one for product one
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion.id,
      ).toBe(optionOneVersion.id);
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion
          .versionNumber,
      ).toBe(optionOneVersion.versionNumber);
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion
          .createdAt,
      ).toBe(optionOneVersion.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion
          .updatedAt,
      ).toBe(optionOneVersion.updatedAt.toISOString());

      // option price one for feature option version one for feature one for product one
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion.price
          .id,
      ).toBe(optionOnePrice.id);
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion.price
          .isPerBag,
      ).toBe(optionOnePrice.isPerBag);
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion.price
          .audInCents,
      ).toBe(optionOnePrice.audInCents);
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion.price
          .createdAt,
      ).toBe(optionOnePrice.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[1].latestVersion.price
          .updatedAt,
      ).toBe(optionOnePrice.updatedAt.toISOString());

      // feature option two for feature one for product one
      expect(result.body.data.products[0].features[0].options[0].id).toBe(
        optionTwo.id,
      );
      expect(result.body.data.products[0].features[0].options[0].name).toBe(
        optionTwo.name,
      );
      expect(
        result.body.data.products[0].features[0].options[0].description,
      ).toBe(optionTwo.description);
      expect(
        result.body.data.products[0].features[0].options[0].isDefault,
      ).toBe(optionTwo.isDefault);
      expect(
        result.body.data.products[0].features[0].options[0].isAvailable,
      ).toBe(optionTwo.isAvailable);
      expect(
        result.body.data.products[0].features[0].options[0].createdAt,
      ).toBe(optionTwo.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[0].updatedAt,
      ).toBe(optionTwo.updatedAt.toISOString());

      // feature option version two for feature option two for product one
      expect(
        result.body.data.products[0].features[0].options[0].latestVersion.id,
      ).toBe(optionTwoVersion.id);
      expect(
        result.body.data.products[0].features[0].options[0].latestVersion
          .versionNumber,
      ).toBe(optionTwoVersion.versionNumber);
      expect(
        result.body.data.products[0].features[0].options[0].latestVersion
          .createdAt,
      ).toBe(optionTwoVersion.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[0].latestVersion
          .updatedAt,
      ).toBe(optionTwoVersion.updatedAt.toISOString());

      // option price one for feature option version one for feature one for product one
      expect(
        result.body.data.products[0].features[0].options[0].latestVersion.price,
      ).toBeNull();

      // feature two for product one
      expect(result.body.data.products[0].features[1].id).toBe(
        productFeatureTwo.id,
      );
      expect(result.body.data.products[0].features[1].name).toBe(
        productFeatureTwo.name,
      );
      expect(result.body.data.products[0].features[1].description).toBe(
        productFeatureTwo.description,
      );
      expect(result.body.data.products[0].features[1].isAvailable).toBe(
        productFeatureTwo.isAvailable,
      );
      expect(result.body.data.products[0].features[1].createdAt).toBe(
        productFeatureTwo.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].features[1].updatedAt).toBe(
        productFeatureTwo.updatedAt.toISOString(),
      );

      // feature option three for feature two for product one
      expect(result.body.data.products[0].features[1].options.length).toBe(1);
      expect(result.body.data.products[0].features[1].options[0].id).toBe(
        optionThree.id,
      );
      expect(result.body.data.products[0].features[1].options[0].name).toBe(
        optionThree.name,
      );
      expect(
        result.body.data.products[0].features[1].options[0].description,
      ).toBe(optionThree.description);
      expect(
        result.body.data.products[0].features[1].options[0].isDefault,
      ).toBe(optionThree.isDefault);
      expect(
        result.body.data.products[0].features[1].options[0].isAvailable,
      ).toBe(optionThree.isAvailable);
      expect(
        result.body.data.products[0].features[1].options[0].createdAt,
      ).toBe(optionThree.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[1].options[0].updatedAt,
      ).toBe(optionThree.updatedAt.toISOString());

      // feature option version three for feature option three for product one
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion.id,
      ).toBe(optionThreeVersion.id);
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion
          .versionNumber,
      ).toBe(optionThreeVersion.versionNumber);
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion
          .createdAt,
      ).toBe(optionThreeVersion.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion
          .updatedAt,
      ).toBe(optionThreeVersion.updatedAt.toISOString());

      // option price three for feature option three for product one
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion.price
          .id,
      ).toBe(optionThreePrice.id);
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion.price
          .isPerBag,
      ).toBe(optionThreePrice.isPerBag);
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion.price
          .audInCents,
      ).toBe(optionThreePrice.audInCents);
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion.price
          .createdAt,
      ).toBe(optionThreePrice.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[1].options[0].latestVersion.price
          .updatedAt,
      ).toBe(optionThreePrice.updatedAt.toISOString());

      // product two
      expect(result.body.data.products[1].id).toBe(productTwo.id);
      expect(result.body.data.products[1].name).toBe(productTwo.name);
      expect(result.body.data.products[1].description).toBe(
        productTwo.description,
      );
      expect(result.body.data.products[1].isAvailable).toBe(
        productTwo.isAvailable,
      );
      expect(result.body.data.products[1].createdAt).toBe(
        productTwo.createdAt.toISOString(),
      );
      expect(result.body.data.products[1].updatedAt).toBe(
        productTwo.updatedAt.toISOString(),
      );

      // image two
      expect(result.body.data.products[1].image.id).toBe(imageTwo.id);
      expect(result.body.data.products[1].image.name).toBe(imageTwo.name);
      expect(result.body.data.products[1].image.key).toBe(imageTwo.key);
      expect(result.body.data.products[1].image.createdAt).toBe(
        imageTwo.createdAt.toISOString(),
      );
      expect(result.body.data.products[1].image.updatedAt).toBe(
        imageTwo.updatedAt.toISOString(),
      );

      // product two version
      expect(result.body.data.products[1].latestVersion.id).toBe(
        productTwoVersion.id,
      );
      expect(result.body.data.products[1].latestVersion.versionNumber).toBe(
        productTwoVersion.versionNumber,
      );
      expect(result.body.data.products[1].latestVersion.createdAt).toBe(
        productTwoVersion.createdAt.toISOString(),
      );
      expect(result.body.data.products[1].latestVersion.updatedAt).toBe(
        productTwoVersion.updatedAt.toISOString(),
      );

      // product two version base price
      expect(result.body.data.products[1].latestVersion.basePrice.id).toBe(
        productTwoBasePrice.id,
      );
      expect(
        result.body.data.products[1].latestVersion.basePrice.isPerBag,
      ).toBe(productTwoBasePrice.isPerBag);
      expect(
        result.body.data.products[1].latestVersion.basePrice.audInCents,
      ).toBe(productTwoBasePrice.audInCents);
      expect(
        result.body.data.products[1].latestVersion.basePrice.createdAt,
      ).toBe(productTwoBasePrice.createdAt.toISOString());
      expect(
        result.body.data.products[1].latestVersion.basePrice.updatedAt,
      ).toBe(productTwoBasePrice.updatedAt.toISOString());

      // product two version express delivery price
      expect(
        result.body.data.products[1].latestVersion.expressDeliveryPrice.id,
      ).toBe(productTwoExpressDeliveryPrice.id);
      expect(
        result.body.data.products[1].latestVersion.expressDeliveryPrice
          .isPerBag,
      ).toBe(productTwoExpressDeliveryPrice.isPerBag);
      expect(
        result.body.data.products[1].latestVersion.expressDeliveryPrice
          .audInCents,
      ).toBe(productTwoExpressDeliveryPrice.audInCents);
      expect(
        result.body.data.products[1].latestVersion.expressDeliveryPrice
          .createdAt,
      ).toBe(productTwoExpressDeliveryPrice.createdAt.toISOString());
      expect(
        result.body.data.products[1].latestVersion.expressDeliveryPrice
          .updatedAt,
      ).toBe(productTwoExpressDeliveryPrice.updatedAt.toISOString());

      // features for product two
      expect(result.body.data.products[1].features.length).toBe(1);
      expect(result.body.data.products[1].features[0].id).toBe(
        productFeatureTwo.id,
      );
      expect(result.body.data.products[1].features[0].name).toBe(
        productFeatureTwo.name,
      );
      expect(result.body.data.products[1].features[0].description).toBe(
        productFeatureTwo.description,
      );
      expect(result.body.data.products[1].features[0].isAvailable).toBe(
        productFeatureTwo.isAvailable,
      );
      expect(result.body.data.products[1].features[0].createdAt).toBe(
        productFeatureTwo.createdAt.toISOString(),
      );
      expect(result.body.data.products[1].features[0].updatedAt).toBe(
        productFeatureTwo.updatedAt.toISOString(),
      );

      // feature options for product two
      expect(result.body.data.products[1].features[0].options.length).toBe(1);
      expect(result.body.data.products[1].features[0].options[0].id).toBe(
        optionThree.id,
      );
      expect(result.body.data.products[1].features[0].options[0].name).toBe(
        optionThree.name,
      );
      expect(
        result.body.data.products[1].features[0].options[0].description,
      ).toBe(optionThree.description);
      expect(
        result.body.data.products[1].features[0].options[0].isDefault,
      ).toBe(optionThree.isDefault);
      expect(
        result.body.data.products[1].features[0].options[0].isAvailable,
      ).toBe(optionThree.isAvailable);
      expect(
        result.body.data.products[1].features[0].options[0].createdAt,
      ).toBe(optionThree.createdAt.toISOString());
      expect(
        result.body.data.products[1].features[0].options[0].updatedAt,
      ).toBe(optionThree.updatedAt.toISOString());

      // feature option versions for product two
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion.id,
      ).toBe(optionThreeVersion.id);
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion
          .versionNumber,
      ).toBe(optionThreeVersion.versionNumber);
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion
          .createdAt,
      ).toBe(optionThreeVersion.createdAt.toISOString());
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion
          .updatedAt,
      ).toBe(optionThreeVersion.updatedAt.toISOString());

      // option price for product two
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion.price
          .id,
      ).toBe(optionThreePrice.id);
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion.price
          .isPerBag,
      ).toBe(optionThreePrice.isPerBag);
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion.price
          .audInCents,
      ).toBe(optionThreePrice.audInCents);
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion.price
          .createdAt,
      ).toBe(optionThreePrice.createdAt.toISOString());
      expect(
        result.body.data.products[1].features[0].options[0].latestVersion.price
          .updatedAt,
      ).toBe(optionThreePrice.updatedAt.toISOString());
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
