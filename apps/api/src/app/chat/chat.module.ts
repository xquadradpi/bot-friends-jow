import { Module } from '@nestjs/common';

import { CacheService } from '../shared/services/cache.service';
import { OpenAiService } from '../shared/services/openai.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [CacheService, OpenAiService, ChatService],
})
export class ChatModule {}
