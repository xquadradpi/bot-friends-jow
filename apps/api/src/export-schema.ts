import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app/app.module';

async function exportSchema() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('bot-friends-jow API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI schema written to ${outputPath}`);

  await app.close();
}

exportSchema().catch((err) => {
  console.error(err);
  process.exit(1);
});
