import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiBody, ApiInternalServerErrorResponse,ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { ChatHistoryDto } from "../dtos/chat-history.dto";
import { ChatMessageDto } from "../dtos/chat-message.dto";
import { ChatResponseDto } from "../dtos/chat-response.dto";
import { ResultType } from "../shared/util";
import { assertAllCasesHandled } from "../shared/util/exhaustiveness-check";
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @ApiOperation({
    summary: 'Get chat history for a user',
  })
  @ApiOkResponse({ type: [ChatHistoryDto] })
  @Get('/history')
  async getHistory(userId: string): Promise<ChatHistoryDto[]> {
    const result = await this.chatService.getHistory(userId);
    const type = result.type;

    switch (type) {
      case ResultType.OK:
        return result.value;
      case ResultType.InternalError:
        throw new InternalServerErrorException(result.error);
      default:
        return assertAllCasesHandled(type)
    }
  }


  @ApiOperation({
    summary: 'Send a chat message',
  })
  @ApiBody({ type: ChatMessageDto })
  @ApiInternalServerErrorResponse()
  @ApiOkResponse({ type: ChatResponseDto })
  @Post()
  async sendMessage(@Body() messageDto: ChatMessageDto) {
    const result = await this.chatService.sendMessage(messageDto.message);
    const type = result.type;

    switch (type) {
      case ResultType.OK:
        return result.value;
      case ResultType.InternalError:
        throw new InternalServerErrorException(result.error);
      default:
        return assertAllCasesHandled(type)
    }
  }
}
