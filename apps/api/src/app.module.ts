import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProtoAuthModule } from './proto-auth/proto-auth.module';
import { CommonModule } from 'apps/dosen/common/common.module';
import { ProtoProfileModule } from './proto-profile/proto-profile.module';
import { ProtoPkmModule } from './proto-pkm/proto-pkm.module';
import { ProtoPresensiModule } from './proto-presensi/proto-presensi.module';
import { ProtoJurnalModule } from './proto-jurnal/proto-jurnal.module';
import { ProtoJurnalService } from './proto-jurnal/proto-jurnal.service';
import { ProtoJurnalController } from './proto-jurnal/proto-jurnal.controller';

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
      {
        name: 'jurnal',
        transport: Transport.GRPC,
        options: {
          package: 'jurnal',
          protoPath: join(__dirname, '../jurnal.proto'),
        },
      },
    ]),
    ProtoAuthModule,
    ProtoProfileModule,
    ProtoPkmModule,
    ProtoPresensiModule,
    ProtoJurnalModule,
  ],
  controllers: [AppController, ProtoJurnalController],
  providers: [AppService, ProtoJurnalService],
})
export class AppModule {}
