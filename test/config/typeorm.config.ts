import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeOrmTestConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: process.env.DB_URL,
      entities: getMetadataArgsStorage().tables.map((t) => t.target),
      keepConnectionAlive: true,
      dropSchema: true,
      synchronize: true,
    };
  }
}
