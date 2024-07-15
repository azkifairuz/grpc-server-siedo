import { Module } from '@nestjs/common';
import { ProtoJurnalController } from './proto-jurnal.controller';
import { ProtoJurnalService } from './proto-jurnal.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'jurnal',
        transport: Transport.GRPC,
        options: {
          package: 'jurnal',
          protoPath: join(__dirname, '../jurnal.proto'),
        },
      },
    ]),
  ],
  controllers: [ProtoJurnalController],
  providers: [ProtoJurnalService],
})
export class ProtoJurnalModule {}
