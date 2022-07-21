import { Resolver } from '@nestjs/graphql';
import { OrderImageService } from './order_image.service';

@Resolver()
export class OrderImageResolver {
  constructor(private readonly orderImageService: OrderImageService) {}
}
