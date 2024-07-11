import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import {
  PROFILE_DOSEN_SERVICE_NAME,
  ProfileDosenClient,
  ProfileDosenRequest,
  UpdateProfileRequest,
} from 'proto/profile';

@Injectable()
export class ProtoProfileService implements OnModuleInit {
  private profileServiceCLient: ProfileDosenClient;
  constructor(@Inject('profile') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.profileServiceCLient = this.clientGrpc.getService<ProfileDosenClient>(
      PROFILE_DOSEN_SERVICE_NAME,
    );
  }

  getDosenProfile(account: Account) {
    return this.profileServiceCLient.getProfile(account);
  }
  updateDosenProfile(account: Account, request: ProfileDosenRequest) {
    const updateRequest: UpdateProfileRequest = { account, request };
    return this.profileServiceCLient.updateProfile(updateRequest);
  }
}
