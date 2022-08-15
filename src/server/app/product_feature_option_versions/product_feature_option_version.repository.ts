import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatureOptionVersion } from './product_feature_option_version.entity';

@EntityRepository(ProductFeatureOptionVersion)
export class ProductFeatureOptionVersionRepository extends Repository<ProductFeatureOptionVersion> {
  findAllWithPrices(ids: string[]): Promise<ProductFeatureOptionVersion[]> {
    return this.createQueryBuilder('productFeatureOptionVersion')
      .leftJoinAndSelect(
        'productFeatureOptionVersion.price',
        'price',
        'price.id = productFeatureOptionVersion.priceId',
      )
      .where('productFeatureOptionVersion.id IN (:ids)', { ids })
      .getMany();
  }
}
