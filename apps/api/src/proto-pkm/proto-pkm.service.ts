import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  GetListPkmRequest,
  PKM_DOSEN_SERVICE_NAME,
  PkmDosenServiceClient,
} from 'proto/pkm';

@Injectable()
export class ProtoPkmService implements OnModuleInit {
  private pkmServiceClient: PkmDosenServiceClient;
  constructor(@Inject('pkm') private clientGrcp: ClientGrpc) {}

  onModuleInit() {
    this.pkmServiceClient = this.clientGrcp.getService<PkmDosenServiceClient>(
      PKM_DOSEN_SERVICE_NAME,
    );
  }

  get(account: Account, page: number) {
    const getRequest: GetListPkmRequest = { account, page };
    return this.pkmServiceClient.getListPkm(getRequest);
  }
}
