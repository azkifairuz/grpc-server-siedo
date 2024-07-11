import { Module } from '@nestjs/common';
import { ProtoProfileController } from './proto-profile.controller';
import { ProtoProfileService } from './proto-profile.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'profile',
        transport: Transport.GRPC,
        options: {
          package: 'profile',
          protoPath: join(__dirname, '../profile.proto'),
        },
      },
    ]),
  ],
  controllers: [ProtoProfileController],
  providers: [ProtoProfileService],
})
export class ProtoProfileModule {}
