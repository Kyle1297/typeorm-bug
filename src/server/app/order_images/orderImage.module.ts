import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderImageService } from './orderImage.service';
import { OrderImageResolver } from './orderImage.resolver';
import { OrderImageRepository } from './orderImage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderImageRepository])],
  providers: [OrderImageResolver, OrderImageService],
  exports: [TypeOrmModule],
})
export class OrderImageModule {}
