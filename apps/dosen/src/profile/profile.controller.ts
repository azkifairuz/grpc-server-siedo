import { Controller } from '@nestjs/common';
import {
  BaseResponse,
  ProfileDosenController,
  UpdateProfileRequest,
} from 'proto/profile';
import { ProfileService } from './profile.service';
import { Authentication } from '../../common/auth.decorator';
import { Account } from '@prisma/client';
import { GrpcMethod } from '@nestjs/microservices';
@Controller('profile')
export class ProfileController implements ProfileDosenController {
  constructor(private readonly profileService: ProfileService) {}

  @GrpcMethod('AuthDosenService', 'getProfile')
  async getProfile(@Authentication() account: Account): Promise<BaseResponse> {
    try {
      return await this.profileService.getProfile(account);
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('AuthDosenService', 'updateProfile')
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
}
