import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [SharedModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
