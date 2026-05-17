import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ...(process.env['REDIS_URL']
        ? { stores: [new KeyvRedis(process.env['REDIS_URL'])] }
        : {}),
    }),
    ChatModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
