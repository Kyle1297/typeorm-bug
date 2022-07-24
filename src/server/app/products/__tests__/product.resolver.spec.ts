import { Test, TestingModule } from '@nestjs/testing';
import {
  productFeatureOptionPriceFactory,
  productPriceFactory,
} from 'test/factories/price.factory';
import {
  productFactory,
  productVersionFactory,
} from 'test/factories/product.factory';
import { productFeatureFactory } from 'test/factories/product_feature.factory';
import {
  productFeatureOptionFactory,
  productFeatureOptionVersionFactory,
} from 'test/factories/product_feature_option.factory';
import { ProductRepository } from '../product.repository';
import { ProductResolver } from '../product.resolver';
import { ProductService } from '../product.service';

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductResolver, ProductService, ProductRepository],
    }).compile();

    resolver = module.get<ProductResolver>(ProductResolver);
    service = module.get<ProductService>(ProductService);
  });

  describe('product', () => {
    it('should retrieve product', async () => {
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(product);

      const result = await resolver.product(product.id);

      expect(result).toBe(product);
    });
  });

  describe('products', () => {
    it('should retrieve all products', async () => {
      const productOne = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
      });
      const productTwo = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
      });
      const products = [productOne, productTwo];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(products);

      const result = await resolver.products();

      expect(result).toEqual(products);
    });
  });
});
