import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatureService } from './product_feature.service';
import { ProductFeatureResolver } from './product_feature.resolver';
import { ProductFeatureRepository } from './product_feature.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatureRepository])],
  providers: [ProductFeatureResolver, ProductFeatureService],
  exports: [TypeOrmModule],
})
export class ProductFeatureModule {}
