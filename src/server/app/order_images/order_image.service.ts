import { Injectable } from '@nestjs/common';
import { OrderImageRepository } from './order_image.repository';

@Injectable()
export class OrderImageService {
  constructor(private readonly orderImageRepository: OrderImageRepository) {}
}
