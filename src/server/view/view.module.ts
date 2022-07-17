import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.CI,
    }),
  ],
  providers: [ViewService],
  controllers: [ViewController],
})
export class ViewModule {}
