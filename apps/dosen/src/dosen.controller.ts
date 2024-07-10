import { Controller } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AuthDosenServiceController,
  BaseResponse,
  DosenLoginRequest,
} from 'proto/auth';

@Controller()
export class DosenController implements AuthDosenServiceController {
  constructor(private readonly dosenService: DosenService) {}

  @GrpcMethod('AuthDosenService', 'loginDosen')
  loginDosen(loginDosen: DosenLoginRequest): Promise<BaseResponse> {
    return this.dosenService.loginDosen(loginDosen);
  }
}
