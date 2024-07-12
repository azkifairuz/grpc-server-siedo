import { Controller } from '@nestjs/common';
import {
  BaseResponse,
  IzinRequest,
  PresensiOfflineRequest,
  PresensiOnlineRequest,
  PresensiServiceController,
} from 'proto/presensi';
import { Observable } from 'rxjs';
import { PresensiService } from './presensi.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('presensi')
export class PresensiController implements PresensiServiceController {
  constructor(private readonly presensiService: PresensiService) {}

  @GrpcMethod('PresensiService', 'presensiOffline')
  presensiOffline(
    request: PresensiOfflineRequest,
  ): BaseResponse | Promise<BaseResponse> | Observable<BaseResponse> {
    try {
      return this.presensiService.presensiOffline(
        request.account,
        request.inLocation,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('PresensiService', 'presensiOnline')
  presensiOnline(
    request: PresensiOnlineRequest,
  ): BaseResponse | Promise<BaseResponse> | Observable<BaseResponse> {
    try {
      return this.presensiService.presensiOnline(request.account);
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('PresensiService', 'izin')
  izin(
    request: IzinRequest,
  ): BaseResponse | Promise<BaseResponse> | Observable<BaseResponse> {
    try {
      return this.presensiService.izin(
        request.account,
        request.reason,
        request.document,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
