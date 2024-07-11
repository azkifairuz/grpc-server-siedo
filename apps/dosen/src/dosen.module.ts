import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../common/common.module';
import { AuthDosenModule } from './auth-dosen/auth-dosen.module';
import { ProfileModule } from './profile/profile.module';
import { PkmDosenModule } from './pkm-dosen/pkm-dosen.module';
@Module({
  imports: [
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthDosenModule,
    ProfileModule,
    PkmDosenModule,
  ],
  controllers: [],
  providers: [],
})
export class DosenModule {}
