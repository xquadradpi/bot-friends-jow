import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ...(process.env['REDIS_URL']
        ? { stores: [new KeyvRedis(process.env['REDIS_URL'])] }
        : {}),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
