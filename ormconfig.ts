import * as dotenv from 'dotenv';

dotenv.config();

export = {
  type: 'postgres' as const,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRS_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/server/app/**/*.entity.ts'],
  migrations: ['src/server/migration/*.{ts,js}'],
  subscribers: ['src/server/app/**/*.subscriber.ts'],
  cli: {
    migrationsDir: 'src/server/migration',
  },
  extra: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  },
};
