import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderImageService } from './order_image.service';
import { OrderImageResolver } from './order_image.resolver';
import { OrderImageRepository } from './order_image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderImageRepository])],
  providers: [OrderImageResolver, OrderImageService],
  exports: [TypeOrmModule],
})
export class OrderImageModule {}
