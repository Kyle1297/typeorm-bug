import { Resolver } from '@nestjs/graphql';
import { ProductImageService } from './productImage.service';

@Resolver()
export class ProductImageResolver {
  constructor(private readonly productImageService: ProductImageService) {}
}
