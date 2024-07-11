import { Module } from '@nestjs/common';
import { PkmDosenController } from './pkm-dosen.controller';
import { PkmDosenService } from './pkm-dosen.service';

@Module({
  controllers: [PkmDosenController],
  providers: [PkmDosenService]
})
export class PkmDosenModule {}
