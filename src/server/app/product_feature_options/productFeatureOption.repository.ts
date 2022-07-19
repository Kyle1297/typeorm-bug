import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatureOption } from './productFeatureOption.entity';

@EntityRepository(ProductFeatureOption)
export class ProductFeatureOptionRepository extends Repository<ProductFeatureOption> {}
