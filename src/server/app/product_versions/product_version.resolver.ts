import { Resolver } from '@nestjs/graphql';
import { ProductVersionService } from './product_version.service';

@Resolver()
export class ProductVersionResolver {
  constructor(private readonly productVersionService: ProductVersionService) {}
}
