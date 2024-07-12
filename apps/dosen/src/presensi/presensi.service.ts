import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'apps/dosen/common/prisma.service';
import { BaseResponse } from 'proto/presensi';
import { uploadFile } from 'utils/fileUploadBucket';

@Injectable()
export class PresensiService {
  constructor(private prismaService: PrismaService) {}

  async presensiOffline(
    isInLocation: boolean,
    account: Account,
  ): Promise<BaseResponse> {
    try {
      if (!isInLocation) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'not in location',
        };
      }

      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: true,
        },
      });
      const date = new Date();
      const currentDate = new Date().toISOString().split('T')[0];

      const today = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const isAlreadyIzinToday = await this.prismaService.izin.findFirst({
        where: {
          tanggal: currentDate,
        },
      });
      if (isAlreadyIzinToday) {
        return {
          statusCode: 400,
          message: 'presensi failed: dosen already izin today',
        };
      }
      const isAlreadyCheckIn = await this.prismaService.riwayatMasuk.findFirst({
        where: {
          AND: [
            {
              tanggal: currentDate,
            },
            {
              nidn: dosen.nidn,
            },
          ],
        },
        orderBy: {
          jam: 'desc',
        },
      });

      if (isAlreadyCheckIn != null) {
        if (isAlreadyCheckIn.kegiatan == 'masuk') {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'presensi failed: dosen already presensi',
          };
        }
      }
      await this.prismaService.riwayatMasuk.create({
        data: {
          hari: today.toString(),
          jam: date.toLocaleTimeString('id-ID'),
          tanggal: `${currentDate}`,
          tipe: 'offline',
          nidn: dosen.nidn,
          kegiatan: 'masuk',
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'presensi success',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `error: ${error}`,
      };
    }
  }

  async presensiOnline(account: Account): Promise<BaseResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: true,
        },
      });
      const date = new Date();
      const currentDate = new Date().toISOString().split('T')[0];

      const today = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const isAlreadyIzinToday = await this.prismaService.izin.findFirst({
        where: {
          tanggal: currentDate,
        },
      });
      if (isAlreadyIzinToday) {
        return {
          statusCode: 400,
          message: 'presensi failed: dosen already izin today',
        };
      }
      const isAlreadyCheckIn = await this.prismaService.riwayatMasuk.findFirst({
        where: {
          AND: [
            {
              tanggal: currentDate,
            },
            {
              nidn: dosen.nidn,
            },
          ],
        },
        orderBy: {
          jam: 'desc',
        },
      });

      if (isAlreadyCheckIn != null) {
        if (isAlreadyCheckIn.kegiatan == 'masuk') {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'presensi failed: dosen already presensi',
          };
        }
      }
      await this.prismaService.riwayatMasuk.create({
        data: {
          hari: today.toString(),
          jam: date.toLocaleTimeString('id-ID'),
          tanggal: `${currentDate}`,
          tipe: 'online',
          nidn: dosen.nidn,
          kegiatan: 'masuk',
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'presensi success',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `error: ${error}`,
      };
    }
  }
  async checkout(account: Account): Promise<BaseResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: true,
        },
      });
      const date = new Date();
      const currentDate = new Date().toISOString().split('T')[0];

      const today = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const isAlreadyCheckOut = await this.prismaService.riwayatMasuk.findFirst(
        {
          where: {
            AND: [
              {
                tanggal: currentDate,
              },
              {
                nidn: dosen.nidn,
              },
            ],
          },
          orderBy: {
            jam: 'desc',
          },
        },
      );

      if (isAlreadyCheckOut != null) {
        if (isAlreadyCheckOut.kegiatan == 'keluar') {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'presensi failed: dosen already checkout',
          };
        }
      }
      await this.prismaService.riwayatMasuk.create({
        data: {
          hari: today.toString(),
          jam: date.toLocaleTimeString('id-ID'),
          tanggal: `${currentDate}`,
          tipe: isAlreadyCheckOut.tipe,
          nidn: dosen.nidn,
          kegiatan: 'keluar',
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'checkout success',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `error: ${error}`,
      };
    }
  }
  async izin(
    account: Account,
    reason: string,
    file: Uint8Array,
  ): Promise<BaseResponse> {
    try {
      const fileUrl = await uploadFile(file);
      const dosesnAcc = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
      });
      const currentDate = new Date().toISOString().split('T')[0];
      const isAlreadyIzinToday = await this.prismaService.izin.findFirst({
        where: {
          tanggal: currentDate,
        },
      });
      if (isAlreadyIzinToday) {
        return {
          statusCode: 400,
          message: 'izin failed: dosen already izin today',
        };
      }

      await this.prismaService.izin.create({
        data: {
          alasan: reason,
          bukti: fileUrl,
          nidn: dosesnAcc.nidn,
          tanggal: currentDate,
        },
      });
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'izin success',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `izin failed: ${error}`,
      };
    }
  }
}
