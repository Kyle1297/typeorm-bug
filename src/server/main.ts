import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import * as cookieParser from 'cookie-parser';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';
import { join } from 'path';

import { ServerModule } from 'src/server/server.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());

  await app.listen(configService.get('PORT', '3000'));

  // generate GraphQL schema
  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync(join(process.cwd(), `/src/schema.gql`), printSchema(schema));
}
bootstrap();
