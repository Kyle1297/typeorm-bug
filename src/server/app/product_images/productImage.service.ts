import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from './productImage.repository';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}
}
