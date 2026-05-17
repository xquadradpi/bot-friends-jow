import { Injectable, Logger } from '@nestjs/common';

import { ChatHistoryDto, MessageRole } from '../dtos/chat-history.dto';
import { ChatResponseDto } from '../dtos/chat-response.dto';
import { CacheService } from '../shared/services/cache.service';
import { OpenAiService } from '../shared/services/openai.service';
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
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly openAiService: OpenAiService,
  ) {}

  async getHistory(userId: string): Promise<ChatHistoryResult> {
    try {
      const history = await this.cacheService.getOrSet<ChatHistoryDto[]>(
        `chat:history:${userId}`,
        async () => [],
        HISTORY_TTL_MS,
      );
      this.logger.log(`Loaded history for user ${userId}: ${history.length} messages`);
      return { type: ResultType.OK, value: history };
    } catch (error) {
      this.logger.error(`Failed to load history for user ${userId}`, error);
      return { type: ResultType.InternalError, error: error as Error };
    }
  }

  async sendMessage(userId: string, message: string): Promise<ChatMessageResult> {
    this.logger.log(`Sending message for user ${userId}`);
    try {
      const cacheKey = `chat:history:${userId}`;

      const history = await this.cacheService.getOrSet<ChatHistoryDto[]>(
        cacheKey,
        async () => [],
        HISTORY_TTL_MS,
      );

      history.push({ role: MessageRole.USER, message, timestamp: new Date() });

      const modelMessages = history.map((entry) =>
        entry.role === MessageRole.USER
          ? { role: 'user' as const, content: entry.message }
          : { role: 'assistant' as const, content: entry.message },
      );

      const responseText = await this.openAiService.chat(modelMessages);
      this.logger.log(`Received response for user ${userId}`);

      history.push({ role: MessageRole.ASSISTANT, message: responseText, timestamp: new Date() });

      await this.cacheService.set(cacheKey, history, HISTORY_TTL_MS);

      return { type: ResultType.OK, value: { message: responseText } };
    } catch (error) {
      this.logger.error(`Failed to send message for user ${userId}`, error);
      return { type: ResultType.InternalError, error: error as Error };
    }
  }
}
