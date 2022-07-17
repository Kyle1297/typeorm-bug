import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { AddressRepository } from './address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AddressRepository])],
  providers: [AddressResolver, AddressService],
  exports: [TypeOrmModule],
})
export class AddressModule {}
