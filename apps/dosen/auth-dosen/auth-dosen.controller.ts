import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AuthDosenServiceController,
  BaseResponse,
  DosenLoginRequest,
} from 'proto/auth';
import { AuthDosenService } from './auth-dosen.service';

@Controller()
export class AuthDosenController implements AuthDosenServiceController {
  constructor(private readonly authService: AuthDosenService) {}

  @GrpcMethod('AuthDosenService', 'loginDosen')
  loginDosen(loginDosen: DosenLoginRequest): Promise<BaseResponse> {
    return this.authService.loginDosen(loginDosen);
  }
}
