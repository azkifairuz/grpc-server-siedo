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
import { JurnalDosenService } from 'apps/dosen/src/jurnal-dosen/jurnal-dosen.service';
import { JurnalRequest } from 'proto/jurnal';

@Controller('dosen/jurnal')
export class ProtoJurnalController {
  constructor(private readonly jurnalService: JurnalDosenService) {}

  @Get()
  get(@Authentication() account: Account, @Param('page') page: string = '1') {
    return this.jurnalService.getListJurnal(account, parseInt(page));
  }

  @Get(':jurnalId')
  getById(
    @Authentication() account: Account,
    @Param('jurnalId') jurnalId: string,
  ) {
    return this.jurnalService.getJurnalById(account, parseInt(jurnalId));
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
    return this.jurnalService.update(
      jurnalRequest,
      parseInt(jurnalId),
      account,
      file,
    );
  }

  @Delete(':jurnalId')
  delete(
    @Authentication() account: Account,
    @Param('jurnalId') jurnalId: string,
  ) {
    return this.jurnalService.delete(account, parseInt(jurnalId));
  }
}
