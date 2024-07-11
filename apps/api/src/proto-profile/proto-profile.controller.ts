import { Controller, Get } from '@nestjs/common';
import { ProtoProfileService } from './proto-profile.service';
import { Authentication } from 'apps/dosen/common/auth.decorator';
import { Account } from '@prisma/client';

@Controller('dosen/profile')
export class ProtoProfileController {
  constructor(private readonly profileService: ProtoProfileService) {}

  @Get()
  getDosenProfile(@Authentication() account: Account) {
    return this.profileService.getDosenProfile(account);
  }
}
