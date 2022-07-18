import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { ImageRepository } from './image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImageRepository])],
  providers: [ImageResolver, ImageService],
  exports: [TypeOrmModule],
})
export class ImageModule {}
