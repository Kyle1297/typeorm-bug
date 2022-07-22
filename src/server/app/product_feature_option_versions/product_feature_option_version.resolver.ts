import { Resolver } from '@nestjs/graphql';
import { ProductFeatureOptionVersionService } from './product_feature_option_version.service';

@Resolver()
export class ProductFeatureOptionVersionResolver {
  constructor(
    private readonly productFeatureOptionVersionService: ProductFeatureOptionVersionService,
  ) {}
}
