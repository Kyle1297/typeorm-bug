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
import { ProductService } from '../product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, ProductRepository],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('findOne', () => {
    it('should return product with given id', async () => {
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
      jest
        .spyOn(productRepository, 'findOneWithImagePricesVersionAndFeatures')
        .mockResolvedValueOnce(product);

      const result = await productService.findOne(product.id);

      expect(result).toBe(product);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
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
      jest
        .spyOn(productRepository, 'findAllWithImagePricesAndVersion')
        .mockResolvedValueOnce(products);

      const result = await productService.findAll();

      expect(result).toEqual(products);
    });
  });
});
