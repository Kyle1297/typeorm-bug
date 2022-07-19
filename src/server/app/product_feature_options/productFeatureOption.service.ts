import { Injectable } from '@nestjs/common';
import { ProductFeatureOptionRepository } from './productFeatureOption.repository';

@Injectable()
export class ProductFeatureOptionService {
  constructor(
    private readonly productfeatureoptionRepository: ProductFeatureOptionRepository,
  ) {}
}
