import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  PRESENSI_SERVICE_NAME,
  PresensiOfflineRequest,
  PresensiServiceClient,
} from 'proto/presensi';

@Injectable()
export class ProtoPresensiService implements OnModuleInit {
  presensiClientService: PresensiServiceClient;
  constructor(@Inject('presensi') private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.presensiClientService =
      this.clientGrpc.getService<PresensiServiceClient>(PRESENSI_SERVICE_NAME);
  }

  presensiOffline(inLocation: boolean, account: Account) {
    const requestPresensiOffline: PresensiOfflineRequest = {
      account,
      inLocation,
    };
    return this.presensiClientService.presensiOffline(requestPresensiOffline);
  }
}
