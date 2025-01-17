// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.0
//   protoc               v5.27.2
// source: proto/jurnal.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "jurnal";

export interface JurnalResponse {
  id: number;
  nidn: string;
  semesterAktif: number;
  judulArtikel: string;
  namaJurnal: string;
  tautanLamanJurnal: string;
  tanggalTerbit: string;
  volume: string;
  nomor: string;
  halaman: string;
  penerbitPenyelanggara: string;
  issn: string;
  uploadDocument: string;
}

export interface JurnalRequest {
  judulArtikel: string;
  namaJurnal: string;
  tautanLamanJurnal: string;
  tanggalTerbit: string;
  volume: string;
  nomor: string;
  halaman: string;
  penerbitPenyelanggara: string;
  issn: string;
}

export interface BaseResponse {
  statusCode: number;
  message: string;
}

export interface Account {
  uuid: string;
  username: string;
  password: string;
  token: string;
}

export interface PaginationData {
  page: number;
  size: number;
  totalPage?: number | undefined;
  totalData?: number | undefined;
}

export interface GetListJurnalRequest {
  account: Account | undefined;
  page: number;
}

export interface GetListJurnalResponse {
  data: JurnalResponse[];
  pagination?: PaginationData | undefined;
  statusCode: number;
  message: string;
}

export interface GetJurnalByIdResponse {
  data?: JurnalResponse | undefined;
  statusCode?: number | undefined;
  message?: string | undefined;
}

export interface GetJurnalByIdRequest {
  jurnalId: number;
  account: Account | undefined;
}

export interface CreateJurnalRequest {
  account: Account | undefined;
  jurnalRequest: JurnalRequest | undefined;
  document: Uint8Array;
}

export interface UpdateJurnalRequest {
  jurnalId: number;
  jurnalRequest: JurnalRequest | undefined;
  account: Account | undefined;
  document?: Uint8Array | undefined;
}

export interface DeleteJurnalRequest {
  jurnalId: number;
  account: Account | undefined;
}

export const JURNAL_PACKAGE_NAME = "jurnal";

export interface JurnalServiceClient {
  getListJurnal(request: GetListJurnalRequest): Observable<GetListJurnalResponse>;

  getJurnalById(request: GetJurnalByIdRequest): Observable<GetJurnalByIdResponse>;

  createJurnal(request: CreateJurnalRequest): Observable<BaseResponse>;

  updateJurnal(request: UpdateJurnalRequest): Observable<BaseResponse>;

  deleteJurnal(request: DeleteJurnalRequest): Observable<BaseResponse>;
}

export interface JurnalServiceController {
  getListJurnal(
    request: GetListJurnalRequest,
  ): Promise<GetListJurnalResponse> | Observable<GetListJurnalResponse> | GetListJurnalResponse;

  getJurnalById(
    request: GetJurnalByIdRequest,
  ): Promise<GetJurnalByIdResponse> | Observable<GetJurnalByIdResponse> | GetJurnalByIdResponse;

  createJurnal(request: CreateJurnalRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;

  updateJurnal(request: UpdateJurnalRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;

  deleteJurnal(request: DeleteJurnalRequest): Promise<BaseResponse> | Observable<BaseResponse> | BaseResponse;
}

export function JurnalServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getListJurnal", "getJurnalById", "createJurnal", "updateJurnal", "deleteJurnal"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("JurnalService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("JurnalService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const JURNAL_SERVICE_NAME = "JurnalService";
