import { Module } from '@nestjs/common';
import { ProtoJurnalController } from './proto-jurnal.controller';
import { ProtoJurnalService } from './proto-jurnal.service';

@Module({
  controllers: [ProtoJurnalController],
  providers: [ProtoJurnalService],
})
export class ProtoJurnalModule {}
