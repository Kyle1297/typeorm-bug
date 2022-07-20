import { Test, TestingModule } from '@nestjs/testing';
import { productFactory } from 'test/factories/product.factory';
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
      const product = productFactory.buildOne();

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(product);

      const result = await resolver.product(product.id);

      expect(result).toBe(product);
    });
  });

  describe('products', () => {
    it('should retrieve all products', async () => {
      const products = productFactory.buildMany(2);

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(products);

      const result = await resolver.products();

      expect(result).toEqual(products);
    });
  });
});
