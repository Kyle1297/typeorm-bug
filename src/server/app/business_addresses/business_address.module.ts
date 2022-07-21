import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessAddressService } from './business_address.service';
import { BusinessAddressResolver } from './business_address.resolver';
import { BusinessAddressRepository } from './business_address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessAddressRepository])],
  providers: [BusinessAddressResolver, BusinessAddressService],
  exports: [TypeOrmModule],
})
export class BusinessAddressModule {}
