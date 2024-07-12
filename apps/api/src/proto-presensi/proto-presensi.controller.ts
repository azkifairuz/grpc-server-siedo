import { Body, Controller, Post } from '@nestjs/common';
import { ProtoPresensiService } from './proto-presensi.service';
import { Authentication } from 'apps/dosen/common/auth.decorator';
import { Account } from '@prisma/client';

@Controller('dosen/presensi')
export class ProtoPresensiController {
  constructor(private presensiService: ProtoPresensiService) {}

  @Post('/offline')
  presensiOffline(
    @Authentication() account: Account,
    @Body('inLocation') inLocation: boolean,
  ) {
    return this.presensiService.presensiOffline(inLocation, account);
  }

  @Post('/online')
  presensiOnline(@Authentication() account: Account) {
    return this.presensiService.presensiOnline(account);
  }
  @Post('/checkout')
  checkout(@Authentication() account: Account) {
    return this.presensiService.checkout(account);
  }
  @Post('/izin')
  izin(
    @Authentication() account: Account,
    @Body('reason') inLocation: boolean,
  ) {
    return this.presensiService.presensiOffline(inLocation, account);
  }
}
