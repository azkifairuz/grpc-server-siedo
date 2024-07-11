// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.0
//   protoc               v4.25.3
// source: proto/pkm.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "pkm";

export interface Account {
  uuid: string;
  username: string;
  password: string;
  token: string;
}

export interface BaseResponse {
  statusCode: number;
  message: string;
}

export interface PkmResponse {
  id: number;
  NIDN: string;
  semesterAktif: string;
  judul: string;
  tahunPelaksanaan: string;
  lamaKegiatan: string;
  lokasiKegiatan: string;
  nomorSkPengesahan: string;
  uploadDocument: string;
}

export interface PkmRequest {
  judul: string;
  tahunPelaksanaan: string;
  lamaKegiatan: string;
  lokasiKegiatan: string;
  nomorSkPengesahan: string;
}

export interface PaginationData {
  page: number;
  size: number;
  totalPage?: number | undefined;
  totalData?: number | undefined;
}

export interface GetListPkmRequest {
  account: Account | undefined;
  page: number;
}

export interface GetListPkmResponse {
  data: PkmResponse[];
  pagination: PaginationData | undefined;
  statusCode: number;
  message: string;
}

export interface CreatePkmRequest {
  account: Account | undefined;
  pkmRequest: PkmRequest | undefined;
  document: Uint8Array;
}

export interface UpdatePkmRequest {
  account: Account | undefined;
  pkmRequest: PkmRequest | undefined;
  pkmId: number;
  document: Uint8Array;
}

export interface GetPkmByIdRequest {
  account: Account | undefined;
  pkmId: number;
}

export interface DeletePkmRequest {
  account: Account | undefined;
  pkmId: number;
}

export const PKM_PACKAGE_NAME = "pkm";

export interface PkmDosenServiceClient {
  getListPkm(request: GetListPkmRequest): Observable<GetListPkmResponse>;

  createPkm(request: CreatePkmRequest): Observable<BaseResponse>;

  updatePkm(request: UpdatePkmRequest): Observable<BaseResponse>;

  getPkmById(request: GetPkmByIdRequest): Observable<PkmResponse>;

  deletePkm(request: DeletePkmRequest): Observable<BaseResponse>;
}

export interface PkmDosenServiceController {
  getListPkm(
    request: GetListPkmRequest,
  ): Promise<GetListPkmResponse> | Observable<GetListPkmResponse> | GetListPkmResponse;

  createPkm(request: CreatePkmRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;

  updatePkm(request: UpdatePkmRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;

  getPkmById(request: GetPkmByIdRequest): Promise<PkmResponse> | Observable<PkmResponse> | PkmResponse;

  deletePkm(request: DeletePkmRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;
}

export function PkmDosenServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getListPkm", "createPkm", "updatePkm", "getPkmById", "deletePkm"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PkmDosenService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PkmDosenService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PKM_DOSEN_SERVICE_NAME = "PkmDosenService";