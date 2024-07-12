import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'apps/dosen/common/prisma.service';
import { ValidationService } from 'apps/dosen/common/validation.service';
import {
  BaseResponse,
  GetListPkmResponse,
  GetPkmByIdResponse,
  PaginationData,
  PkmRequest,
  PkmResponse,
} from 'proto/pkm';
import { PkmValidation } from './pkm.validation';
import { uploadFile } from 'utils/fileUploadBucket';

@Injectable()
export class PkmDosenService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getListPkm(
    account: Account,
    page: number = 1,
  ): Promise<GetListPkmResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: {},
        },
      });

      const semesterActive = await this.prismaService.semesterAktif.findFirst({
        where: {
          status: 'active',
        },
      });
      const totalCount = await this.prismaService.pKM.count({
        where: {
          semesterAktif: semesterActive.id,
        },
      });

      const totalPages = Math.ceil(totalCount / 10);
      const pkmList = await this.prismaService.pKM.findMany({
        take: 10,
        skip: (page - 1) * 10,
        where: {
          AND: [
            {
              semesterAktif: semesterActive.id,
            },
            { nidn: dosen.nidn },
          ],
        },
      });

      const pkmResponse: PkmResponse[] = pkmList.map((pkm) => ({
        id: pkm.id,
        NIDN: pkm.nidn,
        judul: pkm.judul,
        lamaKegiatan: pkm.lama_kegiatan,
        lokasiKegiatan: pkm.lokasi_kegiatan,
        nomorSkPengesahan: pkm.nomor_sk_pengesahan,
        semesterAktif: semesterActive.semester,
        tahunPelaksanaan: pkm.tahun_pelaksanaan,
        uploadDocument: pkm.upload_document,
      }));

      const PaginationData: PaginationData = {
        page,
        size: 10,
        totalData: totalCount,
        totalPage: totalPages,
      };

      return {
        data: pkmResponse,
        pagination: PaginationData,
        statusCode: HttpStatus.OK,
        message: 'succes get list pkm',
      };
    } catch (error) {
      return {
        data: [],
        pagination: {
          page,
          size: 10,
          totalData: 0,
          totalPage: 0,
        },
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An error occurred',
      };
    }
  }

  async createPkm(
    account: Account,
    request: PkmRequest,
    document: Uint8Array,
  ): Promise<BaseResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
      });

      const pkmRequest: PkmRequest = this.validationService.validate(
        PkmValidation.PKM_SCHEMA,
        request,
      );

      const semesterActive = await this.prismaService.semesterAktif.findFirst({
        where: {
          status: 'active',
        },
      });
      const fileUrl = await uploadFile(document);
      await this.prismaService.pKM.create({
        data: {
          judul: pkmRequest.judul,
          lama_kegiatan: pkmRequest.lamaKegiatan,
          lokasi_kegiatan: pkmRequest.lokasiKegiatan,
          nomor_sk_pengesahan: pkmRequest.nomorSkPengesahan,
          tahun_pelaksanaan: pkmRequest.tahunPelaksanaan,
          upload_document: fileUrl,
          nidn: dosen.nidn,
          semesterAktif: semesterActive.id,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'create pkm success',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `server error: ${error}`,
      };
    }
  }

  async updatePkm(
    account: Account,
    request: PkmRequest,
    pkmId: number,
    document: Uint8Array,
  ): Promise<BaseResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
      });

      const pkmRequest: PkmRequest = this.validationService.validate(
        PkmValidation.PKM_SCHEMA,
        request,
      );

      const semesterActive = await this.prismaService.semesterAktif.findFirst({
        where: {
          status: 'active',
        },
      });
      if (!semesterActive) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Active semester not found',
        };
      }

      const isAlreadyHaveFile = await this.prismaService.pKM.findFirst({
        where: {
          AND: [{ nidn: dosen.nidn }, { id: pkmId }],
        },
        select: {
          upload_document: true,
        },
      });

      if (!isAlreadyHaveFile) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'PKM data not found',
        };
      }
      let fileUrl = isAlreadyHaveFile.upload_document;

      if (document) {
        fileUrl = await uploadFile(document);
        console.log('fileNameNew', fileUrl);
      }

      if (isAlreadyHaveFile.upload_document == fileUrl) {
        fileUrl = isAlreadyHaveFile.upload_document;
      }
      await this.prismaService.pKM.update({
        where: {
          id: pkmId,
        },
        data: {
          judul: pkmRequest.judul,
          lama_kegiatan: pkmRequest.lamaKegiatan,
          lokasi_kegiatan: pkmRequest.lokasiKegiatan,
          nomor_sk_pengesahan: pkmRequest.nomorSkPengesahan,
          tahun_pelaksanaan: pkmRequest.tahunPelaksanaan,
          upload_document: fileUrl,
          nidn: dosen.nidn,
          semesterAktif: semesterActive.id,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'edit pkm success',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `server error: ${error}`,
      };
    }
  }

  async getPkmById(
    account: Account,
    pkmId: number,
  ): Promise<GetPkmByIdResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
      });

      const pkmData = await this.prismaService.pKM.findFirst({
        where: {
          AND: [{ id: pkmId }, { nidn: dosen.nidn }],
        },
      });
      if (!pkmData) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'pkm id not found',
        };
      }
      const semesterActive = await this.prismaService.semesterAktif.findFirst({
        where: {
          status: 'active',
        },
      });
      const pkmResponse: PkmResponse = {
        id: pkmData.id,
        NIDN: pkmData.nidn,
        judul: pkmData.judul,
        lamaKegiatan: pkmData.lama_kegiatan,
        lokasiKegiatan: pkmData.lokasi_kegiatan,
        nomorSkPengesahan: pkmData.nomor_sk_pengesahan,
        semesterAktif: semesterActive.semester,
        tahunPelaksanaan: pkmData.tahun_pelaksanaan,
        uploadDocument: pkmData.upload_document,
      };

      return {
        data: pkmResponse,
        statusCode: 200,
        message: 'success',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'an error ocured',
      };
    }
  }

  async delete(account: Account, pkmId: number): Promise<BaseResponse> {
    const dosen = await this.prismaService.dosenAccount.findFirst({
      where: {
        account_id: account.uuid,
      },
    });
    if (!dosen) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'failed dosen not found',
      };
    }
    const isIdValid = await this.prismaService.pKM.findFirst({
      where: {
        id: pkmId,
      },
    });
    if (!isIdValid) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'pkm not found',
      };
    }
    await this.prismaService.pKM.delete({
      where: {
        id: pkmId,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'delete pkm success',
    };
  }
}
