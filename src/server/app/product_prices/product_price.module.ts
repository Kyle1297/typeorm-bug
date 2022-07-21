import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPriceService } from './product_price.service';
import { ProductPriceResolver } from './product_price.resolver';
import { ProductPriceRepository } from './product_price.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPriceRepository])],
  providers: [ProductPriceResolver, ProductPriceService],
  exports: [TypeOrmModule],
})
export class ProductPriceModule {}
