import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressService } from './user_address.service';
import { UserAddressResolver } from './user_address.resolver';
import { UserAddressRepository } from './user_address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressRepository])],
  providers: [UserAddressResolver, UserAddressService],
  exports: [TypeOrmModule],
})
export class UserAddressModule {}
