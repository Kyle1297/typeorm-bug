import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { ServerModule } from 'src/server/server.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());

  await app.listen(configService.get('PORT', '3000'));
}
bootstrap();
