import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestUtils } from './typeorm_test.utils';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { TypeOrmTestConfigService } from '../../config/typeorm.config';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/server/app/app.module';
import { GraphqlConfigService } from 'src/server/config/graphql.config';
import { TypeOrmConfigService } from 'src/server/config/typeorm.config';

export interface E2EApp {
  app: INestApplication;
  dbTestUtils: TypeOrmTestUtils;
  cleanup: () => void;
}

export async function initializeApp() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule, TypeOrmTestUtils],
  })
    .overrideProvider(GraphqlConfigService)
    .useClass(GraphqlTestConfigService)
    .overrideProvider(TypeOrmConfigService)
    .useClass(TypeOrmTestConfigService)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const dbTestUtils = app.get(TypeOrmTestUtils);
  await dbTestUtils.startServer();

  const cleanup = async () => {
    await dbTestUtils.closeServer();
    await app.close();
  };

  return { app, dbTestUtils, cleanup };
}
