import { Controller } from '@nestjs/common';
import {
  Account,
  BaseResponse,
  GetActivityRequest,
  GetActivityResponse,
  IzinRequest,
  PresensiOfflineRequest,
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
        request.inLocation,
        request.account,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('PresensiService', 'presensiOnline')
  presensiOnline(
    request: Account,
  ): BaseResponse | Promise<BaseResponse> | Observable<BaseResponse> {
    try {
      return this.presensiService.presensiOnline(request);
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('PresensiService', 'checkout')
  checkout(
    request: Account,
  ): BaseResponse | Promise<BaseResponse> | Observable<BaseResponse> {
    try {
      return this.presensiService.checkout(request);
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

  @GrpcMethod('PersensiService', 'getActivity')
  getActivity(request: GetActivityRequest): Promise<GetActivityResponse> {
    try {
      return this.presensiService.getActivity(
        request.account,
        request.filter,
        request.page,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
