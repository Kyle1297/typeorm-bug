import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from 'src/server/console/seed.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { GraphqlConfigService } from '../config/graphql.config';
import { TypeOrmConfigService } from '../config/typeorm.config';
import { AddressModule } from './addresses/address.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlConfigService,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.CI,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ConsoleModule,
    UserModule,
    AuthModule,
    AddressModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
