import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ...(process.env['REDIS_URL']
        ? { stores: [new KeyvRedis(process.env['REDIS_URL'])] }
        : {}),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
