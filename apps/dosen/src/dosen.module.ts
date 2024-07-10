import { Module } from '@nestjs/common';
import { DosenController } from './dosen.controller';
import { DosenService } from './dosen.service';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../common/common.module';
@Module({
  imports: [CommonModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [DosenController],
  providers: [DosenService],
})
export class DosenModule {}
