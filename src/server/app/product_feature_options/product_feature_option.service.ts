import { Injectable } from '@nestjs/common';
import { ProductFeatureOptionRepository } from './product_feature_option.repository';

@Injectable()
export class ProductFeatureOptionService {
  constructor(
    private readonly productFeatureOptionRepository: ProductFeatureOptionRepository,
  ) {}
}
