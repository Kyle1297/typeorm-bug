import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findOneWithImagePricesAndFeatures(id: string): Promise<Product> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.prices', 'prices')
      .leftJoinAndSelect('product.features', 'features')
      .where('product.id = :id', { id })
      .getOne();
  }

  async findAllWithImageAndPrices(id: string): Promise<Product> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.prices', 'prices')
      .where('product.id = :id', { id })
      .getOne();
  }
}
