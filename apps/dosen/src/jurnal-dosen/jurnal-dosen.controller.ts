import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  BaseResponse,
  CreateJurnalRequest,
  DeleteJurnalRequest,
  GetJurnalByIdRequest,
  GetJurnalByIdResponse,
  GetListJurnalRequest,
  GetListJurnalResponse,
  JurnalServiceController,
  UpdateJurnalRequest,
} from 'proto/jurnal';
import { JurnalDosenService } from './jurnal-dosen.service';

@Controller('jurnal-dosen')
export class JurnalDosenController implements JurnalServiceController {
  constructor(private jurnalDosenService: JurnalDosenService) {}

  @GrpcMethod('JurnalService', 'getListJurnal')
  async getListJurnal(
    request: GetListJurnalRequest,
  ): Promise<GetListJurnalResponse> {
    try {
      return await this.jurnalDosenService.getListJurnal(
        request.account,
        request.page,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod('JurnalService', 'getJurnalById')
  async getJurnalById(
    request: GetJurnalByIdRequest,
  ): Promise<GetJurnalByIdResponse> {
    try {
      return await this.jurnalDosenService.getJurnalById(
        request.account,
        request.jurnalId,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod('JurnalService', 'createJurnal')
  async createJurnal(request: CreateJurnalRequest): Promise<BaseResponse> {
    try {
      return await this.jurnalDosenService.createJurnal(
        request.account,
        request.jurnalRequest,
        request.document,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod('JurnalService', 'updateJurnal')
  async updateJurnal(request: UpdateJurnalRequest): Promise<BaseResponse> {
    try {
      return await this.jurnalDosenService.update(
        request.jurnalRequest,
        request.jurnalId,
        request.account,
        request.document,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod('JurnalService', 'deleteJurnal')
  async deleteJurnal(request: DeleteJurnalRequest): Promise<BaseResponse> {
    try {
      return await this.jurnalDosenService.delete(
        request.account,
        request.jurnalId,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
