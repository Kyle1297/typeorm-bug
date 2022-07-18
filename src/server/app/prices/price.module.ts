import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceResolver } from './price.resolver';
import { PriceRepository } from './price.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PriceRepository])],
  providers: [PriceResolver, PriceService],
  exports: [TypeOrmModule],
})
export class PriceModule {}
