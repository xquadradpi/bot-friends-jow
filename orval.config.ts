import { defineConfig } from 'orval';

export default defineConfig({
  'bot-friends-jow': {
    input: './openapi.json',
    output: {
      mode: 'tags-split',
      target: 'libs/api-client/src/generated',
      schemas: 'libs/api-client/src/generated/models',
      client: 'fetch',
      baseUrl: 'http://localhost:3000',
      prettier: true,
    },
  },
});
