import { Injectable } from '@nestjs/common';

import { ChatHistoryDto } from "../dtos/chat-history.dto";
import { ChatResponseDto } from "../dtos/chat-response.dto";
import { InternalErrorResult, ResultType, SuccessfulResult } from "../shared/util";

export type ChatHistoryResult =
  | InternalErrorResult<Error>
  | SuccessfulResult<ChatHistoryDto[]>;

export type ChatMessageResult =
  | InternalErrorResult<Error>
  | SuccessfulResult<ChatResponseDto>;

@Injectable()
export class ChatService {

  async getHistory(userId: string): Promise<ChatHistoryResult> {
    return { type: ResultType.OK, value: [] };
  }

  async sendMessage(message: string): Promise<ChatMessageResult> {
    return { type: ResultType.OK, value: { message: 'test' } };
  }
}
