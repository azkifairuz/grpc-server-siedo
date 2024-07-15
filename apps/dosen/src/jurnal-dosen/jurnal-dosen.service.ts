import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'apps/dosen/common/prisma.service';
import {
  BaseResponse,
  GetJurnalByIdResponse,
  GetListJurnalResponse,
  JurnalRequest,
  JurnalResponse,
  PaginationData,
} from 'proto/jurnal';
import { uploadFile } from 'utils/fileUploadBucket';

@Injectable()
export class JurnalDosenService {
  constructor(private prismaService: PrismaService) {}

  async getListJurnal(
    account: Account,
    page: number = 1,
  ): Promise<GetListJurnalResponse> {
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

      const totalCount = await this.prismaService.jurnal.count({
        where: {
          semesterAktif: semesterActive.id,
        },
      });

      const totalPages = Math.ceil(totalCount / 10);
      const jurnalList = await this.prismaService.jurnal.findMany({
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
      if (!jurnalList.length) {
        return {
          data: [],
          pagination: {
            page,
            size: 10,
            totalData: totalCount,
            totalPage: totalPages,
          },
          statusCode: HttpStatus.OK,
          message: 'No jurnal data found.',
        };
      }
      const jurnalResponse: JurnalResponse[] = jurnalList.map((jurnal) => ({
        id: jurnal.id,
        nidn: jurnal.nidn,
        judulArtikel: jurnal.judul_artikel,
        namaJurnal: jurnal.nama_jurnal,
        volume: jurnal.volume,
        nomor: jurnal.nomor,
        tanggalTerbit: jurnal.tanggal_terbit,
        issn: jurnal.ISSN,
        semesterAktif: semesterActive.id,
        halaman: jurnal.halaman,
        penerbitPenyelanggara: jurnal.penerbit_penyelanggara,
        tautanLamanJurnal: jurnal.tatuan_laman_jurnal,
        uploadDocument: jurnal.upload_document,
      }));

      const PaginationData: PaginationData = {
        page,
        size: 10,
        totalData: totalCount,
        totalPage: totalPages,
      };

      return {
        data: jurnalResponse,
        pagination: PaginationData,
        statusCode: HttpStatus.OK,
        message: 'succes get list jurnal',
      };
    } catch (error) {
      return {
        data: [],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `error: ${error}`,
      };
    }
  }

  async getJurnalById(
    account: Account,
    jurnalId: number,
  ): Promise<GetJurnalByIdResponse> {
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

      const jurnal = await this.prismaService.jurnal.findFirst({
        where: {
          AND: [{ id: jurnalId }],
        },
      });

      const jurnalResponse: JurnalResponse = {
        id: dosen.id,
        nidn: dosen.nidn,
        judulArtikel: jurnal.judul_artikel,
        namaJurnal: jurnal.nama_jurnal,
        volume: jurnal.volume,
        nomor: jurnal.nomor,
        tanggalTerbit: jurnal.tanggal_terbit,
        issn: jurnal.ISSN,
        semesterAktif: semesterActive.id,
        halaman: jurnal.halaman,
        penerbitPenyelanggara: jurnal.penerbit_penyelanggara,
        tautanLamanJurnal: jurnal.tatuan_laman_jurnal,
        uploadDocument: jurnal.upload_document,
      };

      return {
        data: jurnalResponse,
        statusCode: HttpStatus.OK,
        message: 'success jurnal',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `failed: ${error}`,
      };
    }
  }

  async createJurnal(
    account: Account,
    request: JurnalRequest,
    document: Uint8Array,
  ): Promise<BaseResponse> {
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

      const file = await uploadFile(document);
      await this.prismaService.jurnal.create({
        data: {
          nidn: dosen.nidn,
          nama_jurnal: request.namaJurnal,
          halaman: request.halaman,
          ISSN: request.issn,
          judul_artikel: request.judulArtikel,
          nomor: request.nomor,
          penerbit_penyelanggara: request.penerbitPenyelanggara,
          tanggal_terbit: request.tanggalTerbit,
          tatuan_laman_jurnal: request.tautanLamanJurnal,
          upload_document: file,
          volume: request.volume,
          semesterAktif: semesterActive.id,
        },
      });

      return {
        message: 'succes create jurnal',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: `error: ${error}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    request: JurnalRequest,
    jurnalId: number,
    account: Account,
    document: Uint8Array,
  ): Promise<BaseResponse> {
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
      if (!semesterActive) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Active semester not found',
        };
      }

      const isAlreadyHaveFile = await this.prismaService.jurnal.findFirst({
        where: {
          AND: [{ nidn: dosen.nidn }, { id: jurnalId }],
        },
        select: {
          upload_document: true,
        },
      });

      if (!isAlreadyHaveFile) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'jurnal data not found',
        };
      }
      let fileUrl = isAlreadyHaveFile.upload_document;

      if (document) {
        fileUrl = await uploadFile(document);
      }

      if (isAlreadyHaveFile.upload_document == fileUrl) {
        fileUrl = isAlreadyHaveFile.upload_document;
      }

      await this.prismaService.jurnal.update({
        where: {
          id: jurnalId,
        },
        data: {
          nidn: dosen.nidn,
          nama_jurnal: request.namaJurnal,
          halaman: request.halaman,
          ISSN: request.issn,
          judul_artikel: request.judulArtikel,
          nomor: request.nomor,
          penerbit_penyelanggara: request.penerbitPenyelanggara,
          tanggal_terbit: request.tanggalTerbit,
          tatuan_laman_jurnal: request.tautanLamanJurnal,
          upload_document: fileUrl,
          volume: request.volume,
          semesterAktif: semesterActive.id,
        },
      });
      return {
        message: 'succes update',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: `error: ${error}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async delete(account: Account, jurnalId: number): Promise<BaseResponse> {
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
    const isIdValid = await this.prismaService.jurnal.findFirst({
      where: {
        id: jurnalId,
      },
    });
    if (!isIdValid) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'jurnal not found',
      };
    }
    await this.prismaService.jurnal.delete({
      where: {
        id: jurnalId,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'delete jurnal success',
    };
  }
}
