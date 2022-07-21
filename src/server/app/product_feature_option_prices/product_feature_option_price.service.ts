import { Injectable } from '@nestjs/common';
import { ProductFeatureOptionPriceRepository } from './product_feature_option_price.repository';

@Injectable()
export class ProductFeatureOptionPriceService {
  constructor(
    private readonly productFeatureOptionPriceRepository: ProductFeatureOptionPriceRepository,
  ) {}
}
