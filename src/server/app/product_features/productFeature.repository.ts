import { EntityRepository, Repository } from 'typeorm';
import { ProductFeature } from './productFeature.entity';

@EntityRepository(ProductFeature)
export class ProductFeatureRepository extends Repository<ProductFeature> {}
