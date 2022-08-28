import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from './src/entity/User';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [User],
  migrations: [],
  subscribers: [],
  synchronize: true,
});

export default dataSource;
