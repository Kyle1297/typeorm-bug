import { Injectable } from '@nestjs/common';
import { PriceRepository } from './price.repository';

@Injectable()
export class PriceService {
  constructor(private readonly priceRepository: PriceRepository) {}
}
