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
  createPkm(request: CreatePkmRequest): Promise<BaseResponse> {
    throw new Error('Method not implemented.');
  }
  @GrpcMethod('PkmDosenService', 'getListPkm')
  updatePkm(request: UpdatePkmRequest): Promise<BaseResponse> {
    throw new Error('Method not implemented.');
  }
  @GrpcMethod('PkmDosenService', 'getListPkm')
  getPkmById(request: GetPkmByIdRequest): Promise<PkmResponse> {
    throw new Error('Method not implemented.');
  }
  @GrpcMethod('PkmDosenService', 'getListPkm')
  deletePkm(request: DeletePkmRequest): Promise<BaseResponse> {
    throw new Error('Method not implemented.');
  }
}
