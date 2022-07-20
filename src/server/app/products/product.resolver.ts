import { UseGuards } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { JwtGqlAuthGuard } from 'src/server/common/guards/jwt-gql-auth.guard';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query((_returns) => [Product])
  @UseGuards(JwtGqlAuthGuard)
  async products(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query((_returns) => Product)
  @UseGuards(JwtGqlAuthGuard)
  async product(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Product> {
    return this.productService.findOne(id);
  }
}
