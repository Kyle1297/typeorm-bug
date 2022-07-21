import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from './product_image.repository';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}
}
