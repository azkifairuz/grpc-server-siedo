import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  CreateJurnalRequest,
  GetJurnalByIdRequest,
  GetListJurnalRequest,
  JURNAL_SERVICE_NAME,
  JurnalRequest,
  JurnalServiceClient,
  UpdateJurnalRequest,
} from 'proto/jurnal';

@Injectable()
export class ProtoJurnalService implements OnModuleInit {
  private jurnalClientService: JurnalServiceClient;

  constructor(@Inject('jurnal') private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.jurnalClientService =
      this.clientGrpc.getService<JurnalServiceClient>(JURNAL_SERVICE_NAME);
  }

  get(account: Account, page: number = 1) {
    const getRequest: GetListJurnalRequest = { account, page };
    return this.jurnalClientService.getListJurnal(getRequest);
  }

  getBydId(account: Account, jurnalId: number = 1) {
    const getByIdRequest: GetJurnalByIdRequest = { account, jurnalId };
    return this.jurnalClientService.getJurnalById(getByIdRequest);
  }

  updateJurnal(
    account: Account,
    jurnalId: number = 1,
    jurnalRequest: JurnalRequest,
    document: Uint8Array,
  ) {
    const updateJurnalRequest: UpdateJurnalRequest = {
      account,
      jurnalId,
      jurnalRequest,
      document,
    };
    return this.jurnalClientService.updateJurnal(updateJurnalRequest);
  }

  createJurnal(
    account: Account,
    jurnalRequest: JurnalRequest,
    document: Uint8Array,
  ) {
    const createJurnalRequest: CreateJurnalRequest = {
      account,
      document,
      jurnalRequest,
    };
    return this.jurnalClientService.createJurnal(createJurnalRequest);
  }
}
