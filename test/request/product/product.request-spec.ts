import * as request from 'supertest';
import { productFactory } from '../../factories/product.factory';
import { gql } from 'apollo-server-express';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import { E2EApp, initializeApp } from '../test-utils/initialize-app';
import { priceFactory } from 'test/factories/price.factory';
import * as faker from 'faker';
import { imageFactory } from 'test/factories/image.factory';
import { productFeatureOptionFactory } from 'test/factories/productFeatureOption';
import { productFeatureFactory } from 'test/factories/productFeature.factory';
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
          image {
            id
            name
            key
            createdAt
            updatedAt
          }
          price {
            id
            isPerBag
            aud_in_cents
            createdAt
            updatedAt
          }
          features {
            id
            name
            description
            options {
              id
              name
              description
              isDefault
              price {
                id
                isPerBag
                aud_in_cents
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
        priceFactory.buildOne({
          entityId: optionId,
          entityType: 'ProductFeatureOption',
        }),
      );
      const productFeatureOption = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          price: optionPrice,
          id: optionId,
          productFeature: productFeature,
        }),
      );

      // product
      const productId = faker.datatype.uuid();
      const image = await e2e.dbTestUtils.saveOne(imageFactory.buildOne());
      const productPrice = await e2e.dbTestUtils.saveOne(
        priceFactory.buildOne({
          entityId: productId,
          entityType: 'Product',
        }),
      );
      const product = await e2e.dbTestUtils.saveOne(
        productFactory.buildOne({
          id: productId,
          price: productPrice,
          image: image,
          features: [productFeature],
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

      // product
      expect(result.body.data.product.id).toBe(product.id);
      expect(result.body.data.product.name).toBe(product.name);
      expect(result.body.data.product.description).toBe(product.description);
      expect(result.body.data.product.createdAt).toBe(
        product.createdAt.toISOString(),
      );
      expect(result.body.data.product.updatedAt).toBe(
        product.updatedAt.toISOString(),
      );

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

      // product price
      expect(result.body.data.product.price.id).toBe(productPrice.id);
      expect(result.body.data.product.price.isPerBag).toBe(
        productPrice.isPerBag,
      );
      expect(result.body.data.product.price.aud_in_cents).toBe(
        productPrice.aud_in_cents,
      );
      expect(result.body.data.product.price.createdAt).toBe(
        productPrice.createdAt.toISOString(),
      );
      expect(result.body.data.product.price.updatedAt).toBe(
        productPrice.updatedAt.toISOString(),
      );

      // features
      expect(result.body.data.product.features.length).toBe(1);
      expect(result.body.data.product.features[0].id).toBe(productFeature.id);
      expect(result.body.data.product.features[0].name).toBe(
        productFeature.name,
      );
      expect(result.body.data.product.features[0].description).toBe(
        productFeature.description,
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
        productFeatureOption.id,
      );
      expect(result.body.data.product.features[0].options[0].name).toBe(
        productFeatureOption.name,
      );
      expect(result.body.data.product.features[0].options[0].description).toBe(
        productFeatureOption.description,
      );
      expect(result.body.data.product.features[0].options[0].isDefault).toBe(
        productFeatureOption.isDefault,
      );
      expect(result.body.data.product.features[0].options[0].createdAt).toBe(
        productFeatureOption.createdAt.toISOString(),
      );
      expect(result.body.data.product.features[0].options[0].updatedAt).toBe(
        productFeatureOption.updatedAt.toISOString(),
      );

      // option price
      expect(result.body.data.product.features[0].options[0].price.id).toBe(
        optionPrice.id,
      );
      expect(
        result.body.data.product.features[0].options[0].price.isPerBag,
      ).toBe(optionPrice.isPerBag);
      expect(
        result.body.data.product.features[0].options[0].price.aud_in_cents,
      ).toBe(optionPrice.aud_in_cents);
      expect(
        result.body.data.product.features[0].options[0].price.createdAt,
      ).toBe(optionPrice.createdAt.toISOString());
      expect(
        result.body.data.product.features[0].options[0].price.updatedAt,
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
          image {
            id
            name
            key
            createdAt
            updatedAt
          }
          price {
            id
            isPerBag
            aud_in_cents
            createdAt
            updatedAt
          }
          features {
            id
            name
            description
            options {
              id
              name
              description
              isDefault
              price {
                id
                isPerBag
                aud_in_cents
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
        priceFactory.buildOne({
          entityId: optionOneId,
          entityType: 'ProductFeatureOption',
        }),
      );
      const productFeatureOptionOne = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          price: optionOnePrice,
          id: optionOneId,
          productFeature: productFeatureOne,
        }),
      );
      const optionTwoId = faker.datatype.uuid();
      const productFeatureOptionTwo = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          price: null,
          id: optionTwoId,
          productFeature: productFeatureOne,
          name: 'Option Two',
          description: 'Option Two Description',
          isDefault: false,
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
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const optionThreeId = faker.datatype.uuid();
      const optionThreePrice = await e2e.dbTestUtils.saveOne(
        priceFactory.buildOne({
          entityId: optionThreeId,
          entityType: 'ProductFeatureOption',
          isPerBag: true,
          aud_in_cents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productFeatureOptionThree = await e2e.dbTestUtils.saveOne(
        productFeatureOptionFactory.buildOne({
          price: optionThreePrice,
          id: optionThreeId,
          productFeature: productFeatureTwo,
          name: 'Option Three',
          description: 'Option Three Description',
          isDefault: true,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );

      // product one
      const productOneId = faker.datatype.uuid();
      const imageOne = await e2e.dbTestUtils.saveOne(imageFactory.buildOne());
      const productOnePrice = await e2e.dbTestUtils.saveOne(
        priceFactory.buildOne({
          entityId: productOneId,
          entityType: 'Product',
          id: faker.datatype.uuid(),
          isPerBag: true,
          aud_in_cents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productOne = await e2e.dbTestUtils.saveOne(
        productFactory.buildOne({
          id: productOneId,
          price: productOnePrice,
          image: imageOne,
          features: [productFeatureOne, productFeatureTwo],
        }),
      );

      // product two
      const productTwoId = faker.datatype.uuid();
      const imageTwo = await e2e.dbTestUtils.saveOne(
        imageFactory.buildOne({
          key: faker.random.word(),
          name: faker.random.word(),
          id: faker.datatype.uuid(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productTwoPrice = await e2e.dbTestUtils.saveOne(
        priceFactory.buildOne({
          entityId: productTwoId,
          entityType: 'Product',
          id: faker.datatype.uuid(),
          isPerBag: true,
          aud_in_cents: faker.datatype.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        }),
      );
      const productTwo = await e2e.dbTestUtils.saveOne(
        productFactory.buildOne({
          id: productTwoId,
          price: productTwoPrice,
          image: imageTwo,
          features: [productFeatureTwo],
          name: 'Product Two',
          description: 'Product Two Description',
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

      // product price for product one
      expect(result.body.data.products[0].price.id).toBe(productOnePrice.id);
      expect(result.body.data.products[0].price.isPerBag).toBe(
        productOnePrice.isPerBag,
      );
      expect(result.body.data.products[0].price.aud_in_cents).toBe(
        productOnePrice.aud_in_cents,
      );
      expect(result.body.data.products[0].price.createdAt).toBe(
        productOnePrice.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].price.updatedAt).toBe(
        productOnePrice.updatedAt.toISOString(),
      );

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
      expect(result.body.data.products[0].features[0].createdAt).toBe(
        productFeatureOne.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].features[0].updatedAt).toBe(
        productFeatureOne.updatedAt.toISOString(),
      );

      // feature option one for feature one for product one
      expect(result.body.data.products[0].features[0].options.length).toBe(2);
      expect(result.body.data.products[0].features[0].options[1].id).toBe(
        productFeatureOptionOne.id,
      );
      expect(result.body.data.products[0].features[0].options[1].name).toBe(
        productFeatureOptionOne.name,
      );
      expect(
        result.body.data.products[0].features[0].options[1].description,
      ).toBe(productFeatureOptionOne.description);
      expect(
        result.body.data.products[0].features[0].options[1].isDefault,
      ).toBe(productFeatureOptionOne.isDefault);
      expect(
        result.body.data.products[0].features[0].options[1].createdAt,
      ).toBe(productFeatureOptionOne.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[1].updatedAt,
      ).toBe(productFeatureOptionOne.updatedAt.toISOString());

      // option price one for feature option one for feature one for product one
      expect(result.body.data.products[0].features[0].options[1].price.id).toBe(
        optionOnePrice.id,
      );
      expect(
        result.body.data.products[0].features[0].options[1].price.isPerBag,
      ).toBe(optionOnePrice.isPerBag);
      expect(
        result.body.data.products[0].features[0].options[1].price.aud_in_cents,
      ).toBe(optionOnePrice.aud_in_cents);
      expect(
        result.body.data.products[0].features[0].options[1].price.createdAt,
      ).toBe(optionOnePrice.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[1].price.updatedAt,
      ).toBe(optionOnePrice.updatedAt.toISOString());

      // feature option two for feature one for product one
      expect(result.body.data.products[0].features[0].options[0].id).toBe(
        productFeatureOptionTwo.id,
      );
      expect(result.body.data.products[0].features[0].options[0].name).toBe(
        productFeatureOptionTwo.name,
      );
      expect(
        result.body.data.products[0].features[0].options[0].description,
      ).toBe(productFeatureOptionTwo.description);
      expect(
        result.body.data.products[0].features[0].options[0].isDefault,
      ).toBe(productFeatureOptionTwo.isDefault);
      expect(
        result.body.data.products[0].features[0].options[0].createdAt,
      ).toBe(productFeatureOptionTwo.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[0].options[0].updatedAt,
      ).toBe(productFeatureOptionTwo.updatedAt.toISOString());

      // option price one for feature option one for feature one for product one
      expect(
        result.body.data.products[0].features[0].options[0].price,
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
      expect(result.body.data.products[0].features[1].createdAt).toBe(
        productFeatureTwo.createdAt.toISOString(),
      );
      expect(result.body.data.products[0].features[1].updatedAt).toBe(
        productFeatureTwo.updatedAt.toISOString(),
      );

      // feature option three for feature two for product one
      expect(result.body.data.products[0].features[1].options.length).toBe(1);
      expect(result.body.data.products[0].features[1].options[0].id).toBe(
        productFeatureOptionThree.id,
      );
      expect(result.body.data.products[0].features[1].options[0].name).toBe(
        productFeatureOptionThree.name,
      );
      expect(
        result.body.data.products[0].features[1].options[0].description,
      ).toBe(productFeatureOptionThree.description);
      expect(
        result.body.data.products[0].features[1].options[0].isDefault,
      ).toBe(productFeatureOptionThree.isDefault);
      expect(
        result.body.data.products[0].features[1].options[0].createdAt,
      ).toBe(productFeatureOptionThree.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[1].options[0].updatedAt,
      ).toBe(productFeatureOptionThree.updatedAt.toISOString());

      // option price three for feature option three for product one
      expect(result.body.data.products[0].features[1].options[0].price.id).toBe(
        optionThreePrice.id,
      );
      expect(
        result.body.data.products[0].features[1].options[0].price.isPerBag,
      ).toBe(optionThreePrice.isPerBag);
      expect(
        result.body.data.products[0].features[1].options[0].price.aud_in_cents,
      ).toBe(optionThreePrice.aud_in_cents);
      expect(
        result.body.data.products[0].features[1].options[0].price.createdAt,
      ).toBe(optionThreePrice.createdAt.toISOString());
      expect(
        result.body.data.products[0].features[1].options[0].price.updatedAt,
      ).toBe(optionThreePrice.updatedAt.toISOString());

      // product two
      expect(result.body.data.products[1].id).toBe(productTwo.id);
      expect(result.body.data.products[1].name).toBe(productTwo.name);
      expect(result.body.data.products[1].description).toBe(
        productTwo.description,
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

      // product price
      expect(result.body.data.products[1].price.id).toBe(productTwoPrice.id);
      expect(result.body.data.products[1].price.isPerBag).toBe(
        productTwoPrice.isPerBag,
      );
      expect(result.body.data.products[1].price.aud_in_cents).toBe(
        productTwoPrice.aud_in_cents,
      );
      expect(result.body.data.products[1].price.createdAt).toBe(
        productTwoPrice.createdAt.toISOString(),
      );
      expect(result.body.data.products[1].price.updatedAt).toBe(
        productTwoPrice.updatedAt.toISOString(),
      );

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
      expect(result.body.data.products[1].features[0].createdAt).toBe(
        productFeatureTwo.createdAt.toISOString(),
      );
      expect(result.body.data.products[1].features[0].updatedAt).toBe(
        productFeatureTwo.updatedAt.toISOString(),
      );

      // feature options for product two
      expect(result.body.data.products[1].features[0].options.length).toBe(1);
      expect(result.body.data.products[1].features[0].options[0].id).toBe(
        productFeatureOptionThree.id,
      );
      expect(result.body.data.products[1].features[0].options[0].name).toBe(
        productFeatureOptionThree.name,
      );
      expect(
        result.body.data.products[1].features[0].options[0].description,
      ).toBe(productFeatureOptionThree.description);
      expect(
        result.body.data.products[1].features[0].options[0].isDefault,
      ).toBe(productFeatureOptionThree.isDefault);
      expect(
        result.body.data.products[1].features[0].options[0].createdAt,
      ).toBe(productFeatureOptionThree.createdAt.toISOString());
      expect(
        result.body.data.products[1].features[0].options[0].updatedAt,
      ).toBe(productFeatureOptionThree.updatedAt.toISOString());

      // option price for product two
      expect(result.body.data.products[1].features[0].options[0].price.id).toBe(
        optionThreePrice.id,
      );
      expect(
        result.body.data.products[1].features[0].options[0].price.isPerBag,
      ).toBe(optionThreePrice.isPerBag);
      expect(
        result.body.data.products[1].features[0].options[0].price.aud_in_cents,
      ).toBe(optionThreePrice.aud_in_cents);
      expect(
        result.body.data.products[1].features[0].options[0].price.createdAt,
      ).toBe(optionThreePrice.createdAt.toISOString());
      expect(
        result.body.data.products[1].features[0].options[0].price.updatedAt,
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
