import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVersionService } from './product_version.service';
import { ProductVersionResolver } from './product_version.resolver';
import { ProductVersionRepository } from './product_version.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVersionRepository])],
  providers: [ProductVersionResolver, ProductVersionService],
  exports: [TypeOrmModule],
})
export class ProductVersionModule {}
