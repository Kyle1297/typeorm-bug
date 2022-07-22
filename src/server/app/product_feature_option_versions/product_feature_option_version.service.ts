import { Injectable } from '@nestjs/common';
import { ProductFeatureOptionVersionRepository } from './product_feature_option_version.repository';

@Injectable()
export class ProductFeatureOptionVersionService {
  constructor(
    private readonly productFeatureOptionVersionRepository: ProductFeatureOptionVersionRepository,
  ) {}
}
