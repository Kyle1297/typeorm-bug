import { Resolver } from '@nestjs/graphql';
import { ProductFeatureOptionService } from './productFeatureOption.service';

@Resolver()
export class ProductFeatureOptionResolver {
  constructor(
    private readonly productfeatureoptionService: ProductFeatureOptionService,
  ) {}
}
