import { Resolver } from '@nestjs/graphql';
import { ProductPriceService } from './product_price.service';

@Resolver()
export class ProductPriceResolver {
  constructor(private readonly productPriceService: ProductPriceService) {}
}
