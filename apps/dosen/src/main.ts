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
        protoPath: [
          join(__dirname, '../auth.proto'),
          join(__dirname, '../profile.proto'),
          join(__dirname, '../pkm.proto'),
          join(__dirname, '../presensi.proto'),
          join(__dirname, '../jurnal.proto'),
        ],
        package: ['auth', 'profile', 'pkm', 'presensi', 'jurnal'],
      },
    },
  );
  await app.listen();
}
bootstrap();
