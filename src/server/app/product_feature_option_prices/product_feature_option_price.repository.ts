import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatureOptionPrice } from './product_feature_option_price.entity';

@EntityRepository(ProductFeatureOptionPrice)
export class ProductFeatureOptionPriceRepository extends Repository<ProductFeatureOptionPrice> {}
