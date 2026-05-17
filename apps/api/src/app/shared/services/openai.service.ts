import { createOpenAI } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { generateText, ModelMessage } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

@Injectable()
export class OpenAiService {
  private readonly model = openrouter.chat('gpt-oss-20b:free');

  async chat(messages: ModelMessage[]): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      system: 'You are a friendly chatbot named Alfons. Respond in the language of the message ( default German ).' +
        'Only respond with pure text, no MARKDOWN or JSON or anything else.',
      messages,
    });
    return text;
  }

}
