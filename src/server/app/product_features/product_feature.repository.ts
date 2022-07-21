import { EntityRepository, Repository } from 'typeorm';
import { ProductFeature } from './product_feature.entity';

@EntityRepository(ProductFeature)
export class ProductFeatureRepository extends Repository<ProductFeature> {}
