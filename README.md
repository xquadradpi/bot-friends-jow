# bot-friends-jow

An NX monorepo with a NestJS API (`api`) and a Vue 3 chat frontend (`ui`). The chatbot is powered by an LLM via [OpenRouter](https://openrouter.ai).

## Project structure

```
apps/
  api/       NestJS backend (port 3000, prefix /api)
  ui/        Vue 3 frontend (Vite, port 4200)
libs/
  api-types/ Auto-generated TypeScript types from the OpenAPI spec
  api-client/ Auto-generated typed HTTP client (orval)
scripts/
  generate-api-client.ts  Orchestrates OpenAPI export + client generation
```

## Prerequisites

- Node.js (see `.nvmrc` or `package.json` for version)
- npm
- An [OpenRouter](https://openrouter.ai) API key

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=sk-or-...
# optional — falls back to in-memory cache if not set
REDIS_URL=redis://localhost:6379
```

## Running the apps

### Both apps at once

```bash
npx nx run-many -t serve --all
```

### API only

```bash
npx nx serve api
```

Available at `http://localhost:3000/api`. Swagger UI at `http://localhost:3000/api/docs`.

### UI only

```bash
npx nx serve ui
```

Available at `http://localhost:4200`.

## Caching (Redis)

The API uses `@nestjs/cache-manager`. By default it runs with an **in-memory store** — no external service required.

To use **Redis**, set `REDIS_URL` in your `.env` or environment:

```bash
REDIS_URL=redis://localhost:6379 npx nx serve api
```

### Starting Redis with Docker

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

## API Client generation

The project uses [orval](https://orval.dev) to generate a fully typed HTTP client from the OpenAPI spec.

### Generate everything

```bash
npm run generate
```

This runs three steps:

1. `api:export-schema` — boots the NestJS app and writes `openapi.json` to the workspace root
2. `api-client:generate` — runs orval to generate typed services and models into `libs/api-client/src/generated/`
3. `nx format:write` — formats the generated files

### Generated output

```
libs/api-client/src/generated/
  chat/
    chat.ts           ← chatControllerGetHistory(), chatControllerSendMessage()
  models/
    chatHistoryDto.ts
    chatMessageDto.ts
    chatResponseDto.ts
```

### Using the client in the UI

```typescript
import { chatControllerSendMessage } from '@bot-friends-jow/api-client';

const response = await chatControllerSendMessage({
  body: { message: 'Hallo!', userId },
});
```

## Building for production

```bash
# Build all apps
npx nx run-many -t build --all

# Build a specific app
npx nx build api
npx nx build ui
```

Output is written to `dist/apps/<app-name>`.

## Testing

Integration tests live in `apps/api/src/**/*.spec.ts` and use the NestJS testing module with supertest — no running server required.

```bash
# Run all tests
npx nx run-many -t test --all

# Run API tests only
npx nx test api

# Run with coverage
npx nx test api --coverage
```

## NX commands

```bash
# Show all available targets for a project
npx nx show project api --web

# Visualize the project graph
npx nx graph
```
