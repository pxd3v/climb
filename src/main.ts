import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//teste
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://www.dynoprojects.com.br',
      'https://www.dynoprojects.com.br',
      'http://localhost:3001',
    ],
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
