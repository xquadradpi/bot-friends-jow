import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChatMessageDto {
  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty()
  @IsString()
  userId!: string;
}
