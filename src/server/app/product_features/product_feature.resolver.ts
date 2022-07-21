import { Resolver } from '@nestjs/graphql';
import { ProductFeatureService } from './product_feature.service';

@Resolver()
export class ProductFeatureResolver {
  constructor(private readonly productfeatureService: ProductFeatureService) {}
}
