import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatureOptionVersion } from './product_feature_option_version.entity';

@EntityRepository(ProductFeatureOptionVersion)
export class ProductFeatureOptionVersionRepository extends Repository<ProductFeatureOptionVersion> {}
