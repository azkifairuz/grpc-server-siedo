import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  GetActivityRequest,
  IzinRequest,
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

  presensiOnline(account: Account) {
    return this.presensiClientService.presensiOnline(account);
  }

  checkout(account: Account) {
    return this.presensiClientService.checkout(account);
  }

  izin(reason: string, document: Uint8Array, account: Account) {
    const requestIzin: IzinRequest = {
      account,
      reason,
      document,
    };
    return this.presensiClientService.izin(requestIzin);
  }
  getActivity(filter: string, page: number = 1, account: Account) {
    const activityRequest: GetActivityRequest = {
      account,
      filter,
      page,
    };
    return this.presensiClientService.getActivity(activityRequest);
  }
  getWeeklyRecap(account: Account) {
    return this.presensiClientService.getWeeklyRecap(account);
  }
}
