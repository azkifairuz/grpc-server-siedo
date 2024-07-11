// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.0
//   protoc               v4.25.3
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface DosenLoginRequest {
  nidn: string;
  password: string;
}

export interface DosenLoginResponse {
  nidn: string;
  token: string;
}

export interface BaseResponse {
  data?: DosenLoginResponse | undefined;
  statusCode: number;
  message: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthDosenServiceClient {
  loginDosen(request: DosenLoginRequest): Observable<BaseResponse>;
}

export interface AuthDosenServiceController {
  loginDosen(request: DosenLoginRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;
}

export function AuthDosenServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["loginDosen"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthDosenService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthDosenService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_DOSEN_SERVICE_NAME = "AuthDosenService";