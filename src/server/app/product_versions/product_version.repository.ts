import { EntityRepository, Repository } from 'typeorm';
import { ProductVersion } from './product_version.entity';

@EntityRepository(ProductVersion)
export class ProductVersionRepository extends Repository<ProductVersion> {
  findOneWithPrices(id: string): Promise<ProductVersion> {
    return this.createQueryBuilder('productVersion')
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
      .where('productVersion.id = :id', { id })
      .getOne();
  }
}
