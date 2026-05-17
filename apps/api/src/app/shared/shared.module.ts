import { Module } from '@nestjs/common';

import { CacheService } from './services/cache.service';
import { OpenAiService } from './services/openai.service';

@Module({
  providers: [CacheService, OpenAiService],
  exports: [CacheService, OpenAiService],
})
export class SharedModule {}
