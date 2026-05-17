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

- Node.js 20+
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

---

## Gedanken zur Herangehensweise

### Monorepo-Struktur

Das Projekt ist als NX-Monorepo aufgebaut, um Backend und Frontend in einem gemeinsamen Repository zu verwalten. Das erleichtert die gemeinsame Nutzung von Typen und ermöglicht es, den API-Client direkt aus der laufenden NestJS-Applikation zu generieren — ohne manuelle Synchronisation zwischen zwei Repositories.

### Typsicherheit zwischen Frontend und Backend

Ein zentrales Ziel war, dass Frontend und Backend dieselben Typen verwenden. Dazu wird beim Build der OpenAPI-Spec aus NestJS exportiert und daraus mit [orval](https://orval.dev) ein vollständig typisierter HTTP-Client generiert. Änderungen an DTOs oder Endpoints werden so direkt im Frontend sichtbar — Tippfehler in Request- oder Response-Strukturen werden zur Kompilierzeit erkannt.

### LLM-Integration über OpenRouter

Statt direkt an einen einzelnen Anbieter gebunden zu sein, wird [OpenRouter](https://openrouter.ai) als Proxy eingesetzt. Das erlaubt es, das Modell flexibel zu wechseln, ohne den Code anzufassen — lediglich der Modellname in `openai.service.ts` muss geändert werden. Als SDK wird das Vercel AI SDK (`ai`) verwendet, das eine einheitliche Schnittstelle über verschiedene Anbieter hinweg bietet.

### Gesprächsverlauf im Cache

Der Chatverlauf wird pro User in Redis (oder im In-Memory-Fallback) gespeichert. Jede Nachricht wird mit der bisherigen History an das Modell übergeben, sodass Kontext über mehrere Nachrichten hinweg erhalten bleibt. Redis wurde gewählt, weil es einfach horizontal skalierbar ist und sich für kurzlebige Session-Daten eignet.

### Testbarkeit

Die Integrationstests greifen direkt auf das NestJS-Testmodul zu, ohne einen echten Server zu starten. Externe Abhängigkeiten (`CacheService`, `OpenAiService`) werden per `overrideProvider` durch leichtgewichtige In-Memory-Mocks ersetzt. So lassen sich Controller, Service und Validierung gemeinsam testen, ohne Netzwerk-Overhead oder Abhängigkeiten zu externen Diensten.
