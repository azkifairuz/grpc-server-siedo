import { Module } from '@nestjs/common';
import { ProtoAuthController } from './proto-auth.controller';
import { ProtoAuthService } from './proto-auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
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
  ],
  controllers: [ProtoAuthController],
  providers: [ProtoAuthService],
})
export class ProtoAuthModule {}
