import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  GetListJurnalRequest,
  JURNAL_SERVICE_NAME,
  JurnalServiceClient,
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

  
}
