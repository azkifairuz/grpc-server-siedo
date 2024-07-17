import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProtoProfileService } from './proto-profile.service';
import { Authentication } from 'apps/dosen/common/auth.decorator';
import { Account } from '@prisma/client';
import { ProfileDosenRequest } from 'proto/profile';

@Controller('dosen/profile')
export class ProtoProfileController {
  constructor(private readonly profileService: ProtoProfileService) {}

  @Get()
  getDosenProfile(@Authentication() account: Account) {
    return this.profileService.getDosenProfile(account);
  }

  @Post()
  updateDosenProfile(
    @Authentication() account: Account,
    @Body() request: ProfileDosenRequest,
  ) {
    return this.profileService.updateDosenProfile(account, request);
  }

  @Get('jadwal')
  getJadwalAll(
    @Authentication() account: Account,
    @Query('page') page: string,
  ) {
    return this.profileService.getJadwalAll(account, parseInt(page));
  }

  @Get('jadwal/dialy')
  getJadwalDialy(
    @Authentication() account: Account,
    @Query('page') page: string,
  ) {
    return this.profileService.getJadwalDialy(account, parseInt(page));
  }
}
