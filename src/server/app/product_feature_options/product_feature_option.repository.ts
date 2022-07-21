import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatureOption } from './product_feature_option.entity';

@EntityRepository(ProductFeatureOption)
export class ProductFeatureOptionRepository extends Repository<ProductFeatureOption> {}
