import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatureOptionService } from './productFeatureOption.service';
import { ProductFeatureOptionResolver } from './productFeatureOption.resolver';
import { ProductFeatureOptionRepository } from './productFeatureOption.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatureOptionRepository])],
  providers: [ProductFeatureOptionResolver, ProductFeatureOptionService],
  exports: [TypeOrmModule],
})
export class ProductFeatureOptionModule {}
