import { forwardRef, Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PaymentModule } from '../payments/payment.module';
import { UserAddressModule } from '../user_addresses/user_address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PaymentModule,
    forwardRef(() => UserAddressModule),
  ],
  providers: [UserResolver, UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
