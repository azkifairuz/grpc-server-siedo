import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DosenLoginRequest } from 'proto/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  loginDosen(@Body() loginRequest: DosenLoginRequest) {
    return this.appService.dosenLogin(loginRequest);
  }
}
