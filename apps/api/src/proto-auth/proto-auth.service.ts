import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_DOSEN_SERVICE_NAME,
  AuthDosenServiceClient,
  DosenLoginRequest,
} from 'proto/auth';

@Injectable()
export class ProtoAuthService implements OnModuleInit {
  private loginServiceClient: AuthDosenServiceClient;
  constructor(@Inject('auth') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.loginServiceClient =
      this.clientGrpc.getService<AuthDosenServiceClient>(
        AUTH_DOSEN_SERVICE_NAME,
      );
  }
  dosenLogin(loginRequest: DosenLoginRequest) {
    return this.loginServiceClient.loginDosen(loginRequest);
  }
}
