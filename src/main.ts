import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const whitelist = [
    configService.get<string>('app.server_url'),
    configService.get<string>('app.client_url'),
  ];
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  // app.enableCors({ exposedHeaders: ['Content-Disposition'] });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('InWeb API')
    .setDescription('The InWeb API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT ?? 3333);
  console.log(`${configService.get<string>('app.server_url')}/swagger`);
}
bootstrap();
