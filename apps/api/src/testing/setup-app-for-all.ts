import { setupApp, TestApp, TestAppConfiguration } from './setup-app';

export function setupAppForAll(
  configuration?: TestAppConfiguration
): () => TestApp {
  let app: TestApp;

  beforeAll(async () => {
    app = await setupApp(configuration);
  });

  beforeEach(() => {
    // No-op by default. Override reset behaviour per-test via configuration
    // if needed (e.g. clear an in-memory cache, truncate tables, etc.).
  });

  afterAll(async () => {
    await app?.close();
  });

  return () => app;
}
