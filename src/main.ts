import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
  .setTitle('API Gestión de Convocatorias')
  .setDescription('Documentación de la API de gestión de convocatorias')
  .setVersion('1.0')
  .addBearerAuth(
    {
      description: 'Por favor, ingrese el token en el siguiente formato: <JWT>',
      name: 'Authorization',
      bearerFormat: 'JWT',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header'
    },
    'access-token',
  )
  .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  };

  app.enableCors(corsOptions)

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, 
    transform:true,
    enableDebugMessages: true
  }))


  await app.listen(3000);

  console.log(`🚀 Servidor corriendo en: http://localhost:5173`);
  console.log(`📝 Documentación Swagger disponible en: http://localhost:3000/api`);
}
bootstrap();
