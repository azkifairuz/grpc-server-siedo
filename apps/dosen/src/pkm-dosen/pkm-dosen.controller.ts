import { Controller } from '@nestjs/common';
import {
  BaseResponse,
  CreatePkmRequest,
  DeletePkmRequest,
  GetListPkmRequest,
  GetListPkmResponse,
  GetPkmByIdRequest,
  GetPkmByIdResponse,
  PkmDosenServiceController,
  UpdatePkmRequest,
} from 'proto/pkm';
import { PkmDosenService } from './pkm-dosen.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Controller('pkm-dosen')
export class PkmDosenController implements PkmDosenServiceController {
  constructor(private readonly pkmDosenService: PkmDosenService) {}
  @GrpcMethod('PkmDosenService', 'getListPkm')
  async getListPkm(request: GetListPkmRequest): Promise<GetListPkmResponse> {
    try {
      return await this.pkmDosenService.getListPkm(
        request.account,
        request.page,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod('PkmDosenService', 'createPKm')
  async createPkm(request: CreatePkmRequest): Promise<BaseResponse> {
    try {
      return await this.pkmDosenService.createPkm(
        request.account,
        request.pkmRequest,
        request.document,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('PkmDosenService', 'updatePkm')
  async updatePkm(request: UpdatePkmRequest): Promise<BaseResponse> {
    try {
      return await this.pkmDosenService.updatePkm(
        request.account,
        request.pkmRequest,
        request.pkmId,
        request.document,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  @GrpcMethod('PkmDosenService', 'getPkmById')
  async getPkmById(request: GetPkmByIdRequest): Promise<GetPkmByIdResponse> {
    try {
      return await this.pkmDosenService.getPkmById(
        request.account,
        request.pkmId,
      );
    } catch (error) {
      throw new RpcException({
        code: Status.NOT_FOUND,
        message: error.message || 'PKM data not found',
      });
    }
  }
  @GrpcMethod('PkmDosenService', 'deletePkm')
  async deletePkm(request: DeletePkmRequest): Promise<BaseResponse> {
    try {
      return await this.pkmDosenService.delete(request.account, request.pkmId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
