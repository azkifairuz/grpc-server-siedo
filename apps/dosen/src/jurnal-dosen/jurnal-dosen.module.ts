import { Module } from '@nestjs/common';
import { JurnalDosenController } from './jurnal-dosen.controller';
import { JurnalDosenService } from './jurnal-dosen.service';

@Module({
  controllers: [JurnalDosenController],
  providers: [JurnalDosenService],
})
export class JurnalDosenModule {}
