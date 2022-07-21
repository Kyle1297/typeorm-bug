import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatureOptionPriceService } from './product_feature_option_price.service';
import { ProductFeatureOptionPriceResolver } from './product_feature_option_price.resolver';
import { ProductFeatureOptionPriceRepository } from './product_feature_option_price.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatureOptionPriceRepository])],
  providers: [
    ProductFeatureOptionPriceResolver,
    ProductFeatureOptionPriceService,
  ],
  exports: [TypeOrmModule],
})
export class ProductFeatureOptionPriceModule {}
