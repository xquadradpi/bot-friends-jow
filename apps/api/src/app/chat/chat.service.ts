import { Injectable } from '@nestjs/common';

import { ChatHistoryDto } from '../dtos/chat-history.dto';
import { ChatResponseDto } from '../dtos/chat-response.dto';
import { CacheService } from '../shared/services/cache.service';
import { InternalErrorResult, ResultType, SuccessfulResult } from '../shared/util';

export type ChatHistoryResult =
  | InternalErrorResult<Error>
  | SuccessfulResult<ChatHistoryDto[]>;

export type ChatMessageResult =
  | InternalErrorResult<Error>
  | SuccessfulResult<ChatResponseDto>;

const HISTORY_TTL_MS = 60 * 60 * 1000; // 1 hour => set to 0 to cache forever

@Injectable()
export class ChatService {
  constructor(private readonly cacheService: CacheService) {}

  async getHistory(userId: string): Promise<ChatHistoryResult> {
    try {
      const history = await this.cacheService.getOrSet<ChatHistoryDto[]>(
        `chat:history:${userId}`,
        async () => [],
        HISTORY_TTL_MS,
      );
      return { type: ResultType.OK, value: history };
    } catch (error) {
      return { type: ResultType.InternalError, error: error as Error };
    }
  }

  async sendMessage(message: string): Promise<ChatMessageResult> {
    return { type: ResultType.OK, value: { message: 'test' } };
  }
}
