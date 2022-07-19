import { Resolver } from '@nestjs/graphql';
import { ProductFeatureService } from './productFeature.service';

@Resolver()
export class ProductFeatureResolver {
  constructor(private readonly productfeatureService: ProductFeatureService) {}
}
