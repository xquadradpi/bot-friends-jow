import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChatMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
