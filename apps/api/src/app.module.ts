import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProtoAuthModule } from './proto-auth/proto-auth.module';
import { CommonModule } from 'apps/dosen/common/common.module';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../auth.proto'),
        },
      },
    ]),
    ProtoAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
