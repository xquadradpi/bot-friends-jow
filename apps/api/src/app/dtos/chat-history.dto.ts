import { ApiProperty } from "@nestjs/swagger";

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export class ChatHistoryDto {
  @ApiProperty()
  role!: MessageRole;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  timestamp!: Date;
}
