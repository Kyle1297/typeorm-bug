import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasherAddressService } from './washer_address.service';
import { WasherAddressResolver } from './washer_address.resolver';
import { WasherAddressRepository } from './washer_address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WasherAddressRepository])],
  providers: [WasherAddressResolver, WasherAddressService],
  exports: [TypeOrmModule],
})
export class WasherAddressModule {}
