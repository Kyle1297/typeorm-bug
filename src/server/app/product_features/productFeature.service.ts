import { Injectable } from '@nestjs/common';
import { ProductFeatureRepository } from './productFeature.repository';

@Injectable()
export class ProductFeatureService {
  constructor(
    private readonly productfeatureRepository: ProductFeatureRepository,
  ) {}
}
