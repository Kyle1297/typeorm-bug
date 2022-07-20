import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.findAllWithImagePricesAndFeatures();
  }

  findOne(id: string): Promise<Product> {
    return this.productRepository.findOneWithImagePricesAndFeatures(id);
  }
}
