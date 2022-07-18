import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasherService } from './washer.service';
import { WasherResolver } from './washer.resolver';
import { WasherRepository } from './washer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WasherRepository])],
  providers: [WasherResolver, WasherService],
  exports: [TypeOrmModule],
})
export class WasherModule {}
