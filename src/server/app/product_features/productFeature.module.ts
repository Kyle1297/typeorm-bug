import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatureService } from './productFeature.service';
import { ProductFeatureResolver } from './productFeature.resolver';
import { ProductFeatureRepository } from './productFeature.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatureRepository])],
  providers: [ProductFeatureResolver, ProductFeatureService],
  exports: [TypeOrmModule],
})
export class ProductFeatureModule {}
