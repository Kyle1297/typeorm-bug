import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findOneWithImagePricesVersionAndFeatures(id: string): Promise<Product> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.features', 'feature')
      .leftJoinAndSelect('feature.options', 'option')
      .leftJoinAndSelect('option.versions', 'optionVersion')
      .leftJoinAndSelect(
        'optionVersion.price',
        'optionPrice',
        'optionPrice.id = optionVersion.priceId',
      )
      .leftJoinAndSelect('product.versions', 'productVersion')
      .leftJoinAndSelect(
        'productVersion.basePrice',
        'basePrice',
        'basePrice.id = productVersion.basePriceId',
      )
      .leftJoinAndSelect(
        'productVersion.expressDeliveryPrice',
        'expressDeliveryPrice',
        'expressDeliveryPrice.id = productVersion.expressDeliveryPriceId',
      )
      .where('product.id = :id', { id })
      .getOne();
  }

  async findAllWithImagePricesVersionAndFeatures(): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.features', 'feature')
      .leftJoinAndSelect('feature.options', 'option')
      .leftJoinAndSelect('option.versions', 'optionVersion')
      .leftJoinAndSelect(
        'optionVersion.price',
        'optionPrice',
        'optionPrice.id = optionVersion.priceId',
      )
      .leftJoinAndSelect('product.versions', 'productVersion')
      .leftJoinAndSelect(
        'productVersion.basePrice',
        'basePrice',
        'basePrice.id = productVersion.basePriceId',
      )
      .leftJoinAndSelect(
        'productVersion.expressDeliveryPrice',
        'expressDeliveryPrice',
        'expressDeliveryPrice.id = productVersion.expressDeliveryPriceId',
      )
      .getMany();
  }
}
