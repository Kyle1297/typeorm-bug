import { EntityRepository, Repository } from 'typeorm';
import { ProductPrice } from './product_price.entity';

@EntityRepository(ProductPrice)
export class ProductPriceRepository extends Repository<ProductPrice> {}
