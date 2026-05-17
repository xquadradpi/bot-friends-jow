import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ...(process.env['REDIS_URL']
        ? { stores: [new KeyvRedis(process.env['REDIS_URL'])] }
        : {}),
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
