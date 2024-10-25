import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { VersioningType } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { SwaggerConfig } from './config/docs/swagger.config';
import { ValidateInputPipe } from './config/pipe/validate.pipe';
import { firebaseParams } from './modules/firebase/config/firebase.params';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger configuration
  SwaggerConfig.config(app);

  // DTO validation pipe configuration
  app.useGlobalPipes(new ValidateInputPipe());

  // CORS
  app.enableCors();

  // Setup firebase admin
  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseParams),
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
