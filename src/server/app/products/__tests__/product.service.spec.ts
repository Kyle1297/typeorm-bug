import { Test, TestingModule } from '@nestjs/testing';
import { priceFactory } from 'test/factories/price.factory';
import { productFactory } from 'test/factories/product.factory';
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
        price: priceFactory.buildOne(),
      });
      jest
        .spyOn(productRepository, 'findOneWithImagePricesAndFeatures')
        .mockResolvedValueOnce(product);

      const result = await productService.findOne(product.id);

      expect(result).toBe(product);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = productFactory.buildMany(2);
      jest
        .spyOn(productRepository, 'findAllWithImagePricesAndFeatures')
        .mockResolvedValueOnce(products);

      const result = await productService.findAll();

      expect(result).toEqual(products);
    });
  });
});
