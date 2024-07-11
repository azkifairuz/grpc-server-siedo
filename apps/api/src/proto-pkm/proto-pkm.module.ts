import { Module } from '@nestjs/common';
import { ProtoPkmService } from './proto-pkm.service';
import { ProtoPkmController } from './proto-pkm.controller';

@Module({
  providers: [ProtoPkmService],
  controllers: [ProtoPkmController]
})
export class ProtoPkmModule {}
