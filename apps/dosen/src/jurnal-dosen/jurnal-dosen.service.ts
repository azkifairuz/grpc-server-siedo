import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'apps/dosen/common/prisma.service';
import {
  GetListJurnalResponse,
  JurnalResponse,
  PaginationData,
} from 'proto/jurnal';

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
}
