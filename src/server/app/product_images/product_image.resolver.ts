import { Resolver } from '@nestjs/graphql';
import { ProductImageService } from './product_image.service';

@Resolver()
export class ProductImageResolver {
  constructor(private readonly productImageService: ProductImageService) {}
}
