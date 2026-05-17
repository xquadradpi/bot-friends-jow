import {
  INestApplication,
  ModuleMetadata,
  Provider,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

export interface TestApp extends INestApplication {
  getTestingModule(): TestingModule;
}

export interface TestAppConfiguration {
  imports?: ModuleMetadata['imports'];
  providers?: Provider[];
  globalPrefix?: string;
  build?: (builder: TestingModuleBuilder) => TestingModuleBuilder;
}

export async function setupApp(
  configuration?: TestAppConfiguration
): Promise<TestApp> {
  let builder = Test.createTestingModule({
    imports: configuration?.imports ?? [],
    providers: configuration?.providers ?? [],
  });

  if (configuration?.build) {
    builder = configuration.build(builder);
  }

  const moduleRef = await builder.compile();

  const app = moduleRef.createNestApplication() as TestApp;
  app.getTestingModule = () => moduleRef;

  const prefix = configuration?.globalPrefix ?? 'api';
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    })
  );

  await app.init();

  return app;
}
