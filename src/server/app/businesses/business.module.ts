import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import { BusinessRepository } from './business.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessRepository])],
  providers: [BusinessResolver, BusinessService],
  exports: [TypeOrmModule],
})
export class BusinessModule {}
