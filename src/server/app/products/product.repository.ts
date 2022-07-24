import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findOneWithImagePricesVersionAndFeatures(id: string): Promise<Product> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.features', 'feature')
      .leftJoinAndSelect('feature.options', 'option')
      .leftJoinAndSelect('option.latestVersion', 'latestOptionVersion')
      .leftJoinAndSelect(
        'latestOptionVersion.price',
        'optionPrice',
        'optionPrice.id = latestOptionVersion.priceId',
      )
      .leftJoinAndSelect('product.latestVersion', 'latestProductVersion')
      .leftJoinAndSelect(
        'latestProductVersion.basePrice',
        'basePrice',
        'basePrice.id = latestProductVersion.basePriceId',
      )
      .leftJoinAndSelect(
        'latestProductVersion.expressDeliveryPrice',
        'expressDeliveryPrice',
        'expressDeliveryPrice.id = latestProductVersion.expressDeliveryPriceId',
      )
      .where('product.id = :id', { id })
      .getOne();
  }

  async findAllWithImagePricesAndVersion(): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.latestVersion', 'latestProductVersion')
      .leftJoinAndSelect(
        'latestProductVersion.basePrice',
        'basePrice',
        'basePrice.id = latestProductVersion.basePriceId',
      )
      .leftJoinAndSelect(
        'latestProductVersion.expressDeliveryPrice',
        'expressDeliveryPrice',
        'expressDeliveryPrice.id = latestProductVersion.expressDeliveryPriceId',
      )
      .getMany();
  }
}
