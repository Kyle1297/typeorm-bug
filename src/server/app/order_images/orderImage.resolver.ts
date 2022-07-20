import { Resolver } from '@nestjs/graphql';
import { OrderImageService } from './orderImage.service';

@Resolver()
export class OrderImageResolver {
  constructor(private readonly orderImageService: OrderImageService) {}
}
