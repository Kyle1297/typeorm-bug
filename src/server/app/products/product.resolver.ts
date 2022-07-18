import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt-gql-auth.guard';
import { Product } from './product.entity';

import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query((_returns) => [Product])
  @UseGuards(JwtGqlAuthGuard)
  async products(id: string): Promise<Product> {
    return this.productService.findAllWithOverview(id);
  }

  @Query((_returns) => Product)
  @UseGuards(JwtGqlAuthGuard)
  async product(id: string): Promise<Product> {
    return this.productService.findOneWithDetails(id);
  }
}
