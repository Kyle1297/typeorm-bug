import { EntityRepository, Repository } from 'typeorm';
import { ProductVersion } from './product_version.entity';

@EntityRepository(ProductVersion)
export class ProductVersionRepository extends Repository<ProductVersion> {}
