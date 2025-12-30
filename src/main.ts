import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Schedule')
    .setDescription('Documentação dos endpoints da API de Agendamento')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'integration-token')
    .addApiKey({ type: 'apiKey', name: 'x-super-admin-key', in: 'header' }, 'super-admin-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api-docs`);
}
bootstrap();

