import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageService } from './product_image.service';
import { ProductImageResolver } from './product_image.resolver';
import { ProductImageRepository } from './product_image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageRepository])],
  providers: [ProductImageResolver, ProductImageService],
  exports: [TypeOrmModule],
})
export class ProductImageModule {}
