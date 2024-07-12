import { Module } from '@nestjs/common';
import { ProtoPresensiController } from './proto-presensi.controller';
import { ProtoPresensiService } from './proto-presensi.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'presensi',
        transport: Transport.GRPC,
        options: {
          package: 'presensi',
          protoPath: join(__dirname, '../presensi.proto'),
        },
      },
    ]),
  ],
  controllers: [ProtoPresensiController],
  providers: [ProtoPresensiService],
})
export class ProtoPresensiModule {}
