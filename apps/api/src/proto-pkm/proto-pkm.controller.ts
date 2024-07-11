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
import { ProtoPkmService } from './proto-pkm.service';
import { Authentication } from 'apps/dosen/common/auth.decorator';
import { Account } from '@prisma/client';
import { PkmRequest } from 'proto/pkm';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('dosen/pkm')
export class ProtoPkmController {
  constructor(private readonly pkmService: ProtoPkmService) {}

  @Get()
  get(@Authentication() account: Account, @Query('page') page: string = '1') {
    return this.pkmService.get(account, parseInt(page));
  }

  @Get(':pkmId')
  getById(@Authentication() account: Account, @Param('pkmId') pkmId: string) {
    return this.pkmService.getById(account, parseInt(pkmId));
  }

  @Post()
  @UseInterceptors(FileInterceptor('document'))
  create(
    @Authentication() account: Account,
    @Body() pkmRequest: PkmRequest,
    @UploadedFile() document: Express.Multer.File,
  ) {
    return this.pkmService.create(account, pkmRequest, document.buffer);
  }
}
