import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageService } from './productImage.service';
import { ProductImageResolver } from './productImage.resolver';
import { ProductImageRepository } from './productImage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageRepository])],
  providers: [ProductImageResolver, ProductImageService],
  exports: [TypeOrmModule],
})
export class ProductImageModule {}
