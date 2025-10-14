import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Абсолютный путь к исходной папке proto (в src)
  const protoPath = path.join(process.cwd(), 'src', 'proto', 'films.proto');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'films',
      protoPath,
      url: `0.0.0.0:${process.env.GRPC_PORT ?? 50057}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.REST_PORT ?? 3000);

  console.log(`REST API running on http://localhost:${process.env.REST_PORT ?? 3000}`);
  console.log(`gRPC server running on 0.0.0.0:${process.env.GRPC_PORT ?? 5001}`);
}

bootstrap();
