import { Module } from '@nestjs/common';
import { ProtoPkmService } from './proto-pkm.service';
import { ProtoPkmController } from './proto-pkm.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'pkm',
        transport: Transport.GRPC,
        options: {
          package: 'pkm',
          protoPath: join(__dirname, '../pkm.proto'),
        },
      },
    ]),
  ],
  providers: [ProtoPkmService],
  controllers: [ProtoPkmController],
})
export class ProtoPkmModule {}
