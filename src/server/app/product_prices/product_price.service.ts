import { Injectable } from '@nestjs/common';
import { ProductPriceRepository } from './product_price.repository';

@Injectable()
export class ProductPriceService {
  constructor(
    private readonly productPriceRepository: ProductPriceRepository,
  ) {}
}
