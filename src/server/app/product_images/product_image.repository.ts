import { EntityRepository, Repository } from 'typeorm';
import { ProductImage } from './product_image.entity';

@EntityRepository(ProductImage)
export class ProductImageRepository extends Repository<ProductImage> {}
