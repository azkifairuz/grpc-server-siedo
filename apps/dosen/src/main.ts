import { NestFactory } from '@nestjs/core';
import { DosenModule } from './dosen.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DosenModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../auth.proto'),
        package: 'auth',
      },
    },
  );
  await app.listen();
}
bootstrap();
