import { Controller } from '@nestjs/common';
import {
  BaseResponse,
  JadwalDosenRequest,
  JadwalDosenResponse,
  ProfileDosenController,
  UpdateProfileRequest,
} from 'proto/profile';
import { ProfileService } from './profile.service';
import { Account } from '@prisma/client';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('profile')
export class ProfileController implements ProfileDosenController {
  constructor(private readonly profileService: ProfileService) {}

  @GrpcMethod('ProfileDosen', 'getProfile')
  async getProfile(account: Account): Promise<BaseResponse> {
    try {
      return await this.profileService.getProfile(account);
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('ProfileDosen', 'updateProfile')
  async updateProfile(request: UpdateProfileRequest): Promise<BaseResponse> {
    try {
      return await this.profileService.updateProfile(
        request.account,
        request.request,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod('ProfileDosen', 'getJadwalDosen')
  async getJadwalDosen(
    request: JadwalDosenRequest,
  ): Promise<JadwalDosenResponse> {
    try {
      return await this.profileService.getJadwalAll(
        request.account,
        request.page,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('ProfileDosen', 'getJadwalDosenDaily')
  async getJadwalDosenDaily(
    request: JadwalDosenRequest,
  ): Promise<JadwalDosenResponse> {
    try {
      return await this.profileService.getJadwalDaily(
        request.account,
        request.page,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
