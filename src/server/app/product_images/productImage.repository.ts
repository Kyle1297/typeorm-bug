import { EntityRepository, Repository } from 'typeorm';
import { ProductImage } from './productImage.entity';

@EntityRepository(ProductImage)
export class ProductImageRepository extends Repository<ProductImage> {}
