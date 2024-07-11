import { Body, Controller, Post } from '@nestjs/common';
import { ProtoAuthService } from './proto-auth.service';
import { DosenLoginRequest } from 'proto/auth';

@Controller('dosen/auth')
export class ProtoAuthController {
  constructor(private readonly appService: ProtoAuthService) {}

  @Post()
  loginDosen(@Body() loginRequest: DosenLoginRequest) {
    return this.appService.dosenLogin(loginRequest);
  }
}
