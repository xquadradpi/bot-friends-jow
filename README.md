# bot-friends-jow

An NX monorepo with a NestJS API (`api`) and a Vue 3 frontend (`ui`).

## Project structure

```
apps/
  api/       NestJS backend (port 3000, prefix /api)
  api-e2e/   Playwright E2E tests for the API
  ui/        Vue 3 frontend (Vite)
  ui-e2e/    Playwright E2E tests for the UI
libs/
  api-types/ Auto-generated TypeScript types from the OpenAPI spec
```

## Prerequisites

- Node.js (see `.nvmrc` or `package.json` for version)
- npm

## Setup

```bash
npm install
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

The API will be available at `http://localhost:3000/api`.

### UI only

```bash
npx nx serve ui
```

The UI will be available at `http://localhost:4200`.

## Caching (Redis)

The API uses `@nestjs/cache-manager` for caching. By default it runs with an **in-memory store** — no external service required.

To use **Redis** instead, set the `REDIS_URL` environment variable before starting the API:

```bash
REDIS_URL=redis://localhost:6379 npx nx serve api
```

Or add it to a `.env` file in the project root:

```env
REDIS_URL=redis://localhost:6379
```

If `REDIS_URL` is not set, the app falls back to in-memory caching automatically.

### Starting Redis with Docker

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

## Swagger & API types

The API exposes a Swagger UI at `http://localhost:3000/api/docs` when running in development.

### Generate TypeScript types for the UI

Types are auto-generated from the OpenAPI spec into `libs/api-types` and importable as `@bot-friends-jow/api-types`.

```bash
npx nx run api-types:generate
```

This runs two steps automatically:
1. `api:export-schema` — boots the NestJS app without listening and writes `openapi.json` to the workspace root
2. `api-types:generate` — runs `openapi-typescript` to generate `libs/api-types/src/generated.ts`

### Adding a DTO to the spec

Decorate your DTO class with `@ApiProperty()` so it appears in the spec:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
```

After adding DTOs, re-run `npx nx run api-types:generate`.

### Using types in the UI

```typescript
import type { ApiSchemas } from '@bot-friends-jow/api-types';

type User = ApiSchemas['CreateUserDto'];
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

```bash
# Run all tests
npx nx run-many -t test --all

# Test a specific app
npx nx test api
npx nx test ui
```

## E2E tests

```bash
npx nx e2e api-e2e
npx nx e2e ui-e2e
```

## NX commands

```bash
# Show all available targets for a project
npx nx show project api --web

# Visualize the project graph
npx nx graph
```
