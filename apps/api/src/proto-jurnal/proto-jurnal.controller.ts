import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Account } from '@prisma/client';
import { Authentication } from 'apps/dosen/common/auth.decorator';
import { JurnalRequest } from 'proto/jurnal';
import { ProtoJurnalService } from './proto-jurnal.service';

@Controller('dosen/jurnal')
export class ProtoJurnalController {
  constructor(private readonly jurnalService: ProtoJurnalService) {}

  @Get()
  get(@Authentication() account: Account, @Param('page') page: string = '1') {
    return this.jurnalService.get(account, parseInt(page));
  }

  @Get(':jurnalId')
  getById(
    @Authentication() account: Account,
    @Param('jurnalId') jurnalId: string,
  ) {
    return this.jurnalService.getBydId(account, parseInt(jurnalId));
  }

  @Post()
  @UseInterceptors(FileInterceptor('document'))
  create(
    @Authentication() account: Account,
    @Body() jurnalRequest: JurnalRequest,
    @UploadedFile() document: Express.Multer.File,
  ) {
    return this.jurnalService.createJurnal(
      account,
      jurnalRequest,
      document.buffer,
    );
  }

  @Post(':jurnalId')
  @UseInterceptors(FileInterceptor('document'))
  update(
    @Authentication() account: Account,
    @Body() jurnalRequest: JurnalRequest,
    @Param('jurnalId') jurnalId: string,
    @UploadedFile() document: Express.Multer.File,
  ) {
    let file = null;
    if (document != null) {
      file = document.buffer;
    }
    return this.jurnalService.updateJurnal(
      account,
      parseInt(jurnalId),
      jurnalRequest,
      file,
    );
  }

  @Delete(':jurnalId')
  delete(
    @Authentication() account: Account,
    @Param('jurnalId') jurnalId: string,
  ) {
    return this.jurnalService.deleteJurnal(account, parseInt(jurnalId));
  }
}
