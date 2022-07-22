import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatureOptionVersionService } from './product_feature_option_version.service';
import { ProductFeatureOptionVersionResolver } from './product_feature_option_version.resolver';
import { ProductFeatureOptionVersionRepository } from './product_feature_option_version.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatureOptionVersionRepository])],
  providers: [
    ProductFeatureOptionVersionResolver,
    ProductFeatureOptionVersionService,
  ],
  exports: [TypeOrmModule],
})
export class ProductFeatureOptionVersionModule {}
