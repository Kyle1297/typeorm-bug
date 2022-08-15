import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressService } from './user_address.service';
import { UserAddressResolver } from './user_address.resolver';
import { UserAddressRepository } from './user_address.repository';
import { UserModule } from '../users/user.module';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddressRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => PaymentModule),
  ],
  providers: [UserAddressResolver, UserAddressService],
  exports: [TypeOrmModule, UserAddressService],
})
export class UserAddressModule {}
