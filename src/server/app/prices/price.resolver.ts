import { Resolver } from '@nestjs/graphql';
import { PriceService } from './price.service';

@Resolver()
export class PriceResolver {
  constructor(private readonly priceService: PriceService) {}
}
