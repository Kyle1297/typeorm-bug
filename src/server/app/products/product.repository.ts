import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findOneWithImagePricesAndFeatures(id: string): Promise<Product> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.features', 'feature')
      .leftJoinAndSelect('feature.options', 'option')
      .leftJoinAndSelect(
        'product.price',
        'productPrice',
        'productPrice.id = product.priceId',
      )
      .leftJoinAndSelect(
        'option.price',
        'optionPrice',
        'optionPrice.id = option.priceId',
      )
      .where('product.id = :id', { id })
      .getOne();
  }

  async findAllWithImagePricesAndFeatures(): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.features', 'feature')
      .leftJoinAndSelect('feature.options', 'option')
      .leftJoinAndSelect(
        'product.price',
        'productPrice',
        'productPrice.id = product.priceId',
      )
      .leftJoinAndSelect(
        'option.price',
        'optionPrice',
        'optionPrice.id = option.priceId',
      )
      .getMany();
  }
}
