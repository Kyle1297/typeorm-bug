import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatureOptionService } from './product_feature_option.service';
import { ProductFeatureOptionResolver } from './product_feature_option.resolver';
import { ProductFeatureOptionRepository } from './product_feature_option.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatureOptionRepository])],
  providers: [ProductFeatureOptionResolver, ProductFeatureOptionService],
  exports: [TypeOrmModule],
})
export class ProductFeatureOptionModule {}
