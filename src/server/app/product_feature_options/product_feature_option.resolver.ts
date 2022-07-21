import { Resolver } from '@nestjs/graphql';
import { ProductFeatureOptionService } from './product_feature_option.service';

@Resolver()
export class ProductFeatureOptionResolver {
  constructor(
    private readonly productfeatureoptionService: ProductFeatureOptionService,
  ) {}
}
