import { Injectable } from '@nestjs/common';
import { ProductVersionRepository } from './product_version.repository';

@Injectable()
export class ProductVersionService {
  constructor(
    private readonly productVersionRepository: ProductVersionRepository,
  ) {}
}
