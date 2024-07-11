import { Controller } from '@nestjs/common';
import {
  BaseResponse,
  CreatePkmRequest,
  DeletePkmRequest,
  GetListPkmRequest,
  GetListPkmResponse,
  GetPkmByIdRequest,
  PkmDosenServiceController,
  PkmResponse,
  UpdatePkmRequest,
} from 'proto/pkm';
import { PkmDosenService } from './pkm-dosen.service';
import { GrpcMethod } from '@nestjs/microservices';

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

  @GrpcMethod('PkmDosenService', 'getListPkm')
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
  @GrpcMethod('PkmDosenService', 'getListPkm')
  async updatePkm(request: UpdatePkmRequest): Promise<BaseResponse> {
    throw new Error('Method not implemented.');
  }
  @GrpcMethod('PkmDosenService', 'getListPkm')
  async getPkmById(request: GetPkmByIdRequest): Promise<PkmResponse> {
    throw new Error('Method not implemented.');
  }
  @GrpcMethod('PkmDosenService', 'getListPkm')
  async deletePkm(request: DeletePkmRequest): Promise<BaseResponse> {
    throw new Error('Method not implemented.');
  }
}
