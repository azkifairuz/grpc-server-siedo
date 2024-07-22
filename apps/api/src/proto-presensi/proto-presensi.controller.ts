import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProtoPresensiService } from './proto-presensi.service';
import { Authentication } from 'apps/dosen/common/auth.decorator';
import { Account } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('document'))
  izin(
    @Authentication() account: Account,
    @Body('reason') reason: string,
    @UploadedFile() document: Express.Multer.File,
  ) {
    return this.presensiService.izin(reason, document.buffer, account);
  }

  @Get('activity/:filter')
  activity(
    @Authentication() account: Account,
    @Param('filter') filter: string,
    @Query('page') page: string = '1',
  ) {
    return this.presensiService.getActivity(filter, parseInt(page), account);
  }

  @Get('weekly-recap')
  weeklyRecap(@Authentication() account: Account) {
    return this.presensiService.getWeeklyRecap(account);
  }
}
