import { Resolver } from '@nestjs/graphql';
import { ProductFeatureOptionPriceService } from './product_feature_option_price.service';

@Resolver()
export class ProductFeatureOptionPriceResolver {
  constructor(
    private readonly productFeatureOptionPriceService: ProductFeatureOptionPriceService,
  ) {}
}
