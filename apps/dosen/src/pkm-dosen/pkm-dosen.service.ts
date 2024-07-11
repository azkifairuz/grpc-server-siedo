import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'apps/dosen/common/prisma.service';
import { ValidationService } from 'apps/dosen/common/validation.service';
import { GetListPkmResponse, PaginationData, PkmResponse } from 'proto/pkm';

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
    } catch (error) {}
  }
}
