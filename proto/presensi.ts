// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.0
//   protoc               v4.25.3
// source: proto/presensi.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "presensi";

export interface Account {
  uuid: string;
  username: string;
  password: string;
  token: string;
}

export interface PresensiOfflineRequest {
  inLocation: boolean;
  account: Account | undefined;
}

export interface PresensiOnlineRequest {
  Account: Account | undefined;
}

export interface IzinRequest {
  account: Account | undefined;
  reason: string;
  document: Uint8Array;
}

export interface BaseResponse {
  statusCode: number;
  message: string;
}

export const PRESENSI_PACKAGE_NAME = "presensi";

export interface PresensiServiceClient {
  presensiOffline(request: PresensiOfflineRequest): Observable<BaseResponse>;

  presensiOnline(request: PresensiOnlineRequest): Observable<BaseResponse>;

  izin(request: IzinRequest): Observable<BaseResponse>;
}

export interface PresensiServiceController {
  presensiOffline(request: PresensiOfflineRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;

  presensiOnline(request: PresensiOnlineRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;

  izin(request: IzinRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;
}

export function PresensiServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["presensiOffline", "presensiOnline", "izin"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PresensiService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PresensiService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRESENSI_SERVICE_NAME = "PresensiService";