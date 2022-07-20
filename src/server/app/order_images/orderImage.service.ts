import { Injectable } from '@nestjs/common';
import { OrderImageRepository } from './orderImage.repository';

@Injectable()
export class OrderImageService {
  constructor(private readonly orderImageRepository: OrderImageRepository) {}
}
