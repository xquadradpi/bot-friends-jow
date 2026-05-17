import supertest from 'supertest';

import { setupAppForAll } from '../../testing/setup-app-for-all';
import { CacheService } from '../shared/services/cache.service';
import { OpenAiService } from '../shared/services/openai.service';
import { ChatModule } from './chat.module';

const mockOpenAiService: Pick<OpenAiService, 'chat'> = {
  chat: () => Promise.resolve('Mock-Antwort vom Bot'),
};

const cacheStore = new Map<string, unknown>();
const mockCacheService: Pick<CacheService, 'get' | 'set' | 'delete' | 'getOrSet'> = {
  get: <T>(key: string) => Promise.resolve(cacheStore.get(key) as T ?? null),
  set: (key: string, value: unknown) => { cacheStore.set(key, value); return Promise.resolve(); },
  delete: (key: string) => { cacheStore.delete(key); return Promise.resolve(); },
  getOrSet: async <T>(key: string, factory: () => Promise<T>) => {
    const cached = cacheStore.get(key) as T;
    if (cached !== undefined) return cached;
    const value = await factory();
    cacheStore.set(key, value);
    return value;
  },
};

describe('ChatController', () => {
  beforeEach(() => cacheStore.clear());

  const getApp = setupAppForAll({
    imports: [ChatModule],
    build: (builder) =>
      builder
        .overrideProvider(CacheService).useValue(mockCacheService)
        .overrideProvider(OpenAiService).useValue(mockOpenAiService),
  });

  describe('GET /chat/history/:userId', () => {
    it('should return 404 if userId is missing', async () => {
      const res = await supertest(getApp().getHttpServer()).get('/api/chat/history');

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual('Not Found');
    });

    it('should return chat history for user', async () => {
      const userId = 'test-user-id';
      const res = await supertest(getApp().getHttpServer()).get(`/api/chat/history/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /chat', () => {
    it('should return 422 if message is missing', async () => {
      const res = await supertest(getApp().getHttpServer())
        .post('/api/chat')
        .send({ message: '', userId: 'test-user-id' });

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual('Unprocessable Entity');
    });

    it('should return 422 if userId is missing', async () => {
      const res = await supertest(getApp().getHttpServer())
        .post('/api/chat')
        .send({ message: 'Hallo', userId: '' });

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual('Unprocessable Entity');
    });

    it('should return 422 if body is empty', async () => {
      const res = await supertest(getApp().getHttpServer())
        .post('/api/chat')
        .send({});

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual('Unprocessable Entity');
    });

    it('should return 200 with a message from ai agent', async () => {
      const res = await supertest(getApp().getHttpServer())
        .post('/api/chat')
        .send({ message: 'Hallo', userId: 'test-user-123' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Mock-Antwort vom Bot' });
    });

    it('should persist user and assistant messages in history', async () => {
      const userId = 'test-user-history';
      const server = getApp().getHttpServer();

      await supertest(server)
        .post('/api/chat')
        .send({ message: 'Erste Nachricht', userId });

      const res = await supertest(server).get(`/api/chat/history/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({ role: 'user', message: 'Erste Nachricht' });
      expect(res.body[1]).toMatchObject({ role: 'assistant', message: 'Mock-Antwort vom Bot' });
    });
  })
});
