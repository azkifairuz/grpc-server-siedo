import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProtoAuthModule } from './proto-auth/proto-auth.module';
import { CommonModule } from 'apps/dosen/common/common.module';
import { ProtoProfileModule } from './proto-profile/proto-profile.module';
import { ProtoPkmModule } from './proto-pkm/proto-pkm.module';

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
      {
        name: 'profile',
        transport: Transport.GRPC,
        options: {
          package: 'profile',
          protoPath: join(__dirname, '../profile.proto'),
        },
      },
      {
        name: 'pkm',
        transport: Transport.GRPC,
        options: {
          package: 'pkm',
          protoPath: join(__dirname, '../pkm.proto'),
        },
      },
    ]),
    ProtoAuthModule,
    ProtoProfileModule,
    ProtoPkmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
