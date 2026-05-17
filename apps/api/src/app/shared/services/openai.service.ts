import { openai } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { generateText, ModelMessage } from 'ai';

@Injectable()
export class OpenAiService {
  private readonly model = openai('gpt-4o');

  async generateText(prompt: string): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      prompt,
    });
    return text;
  }

  async chat(messages: ModelMessage[]): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      messages,
    });
    return text;
  }

}
