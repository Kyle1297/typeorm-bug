import { Injectable } from '@nestjs/common';
import { ProductFeatureRepository } from './product_feature.repository';

@Injectable()
export class ProductFeatureService {
  constructor(
    private readonly productfeatureRepository: ProductFeatureRepository,
  ) {}
}
