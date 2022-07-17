import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeOrmTestConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRS_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: getMetadataArgsStorage().tables.map((t) => t.target),
      keepConnectionAlive: true,
      dropSchema: true,
      synchronize: true,
    };
  }
}
