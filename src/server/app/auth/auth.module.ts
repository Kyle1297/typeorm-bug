import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialProviderRepository } from './auth.repository';
import jwtConfig from 'src/server/config/jwt.config';
import googleConfig from 'src/server/config/google.config';
import facebookConfig from 'src/server/config/facebook.config';
import { UserModule } from '../users/user.module';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleConfig),
    ConfigModule.forFeature(facebookConfig),
    TypeOrmModule.forFeature([SocialProviderRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signInOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PaymentModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
  exports: [],
})
export class AuthModule {}
