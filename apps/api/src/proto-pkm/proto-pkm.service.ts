import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  CreatePkmRequest,
  GetListPkmRequest,
  GetPkmByIdRequest,
  PKM_DOSEN_SERVICE_NAME,
  PkmDosenServiceClient,
  PkmRequest,
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

  get(account: Account, page: number = 1) {
    const getRequest: GetListPkmRequest = { account, page };
    return this.pkmServiceClient.getListPkm(getRequest);
  }

  getById(account: Account, pkmId: number) {
    const getByIdReq: GetPkmByIdRequest = { account, pkmId };
    return this.pkmServiceClient.getPkmById(getByIdReq);
  }

  create(account: Account, pkmRequest: PkmRequest, document: Uint8Array) {
    const createRequest: CreatePkmRequest = { account, pkmRequest, document };
    return this.pkmServiceClient.createPkm(createRequest);
  }
}
