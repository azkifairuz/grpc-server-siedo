import { Module } from '@nestjs/common';
import { AuthDosenController } from './auth-dosen.controller';
import { AuthDosenService } from './auth-dosen.service';

@Module({
  controllers: [AuthDosenController],
  providers: [AuthDosenService],
})
export class AuthDosenModule {}
