import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'apps/dosen/common/prisma.service';
import {
  Activity,
  BaseResponse,
  GetActivityResponse,
  PaginationData,
  WeeklyRecapResponse,
} from 'proto/presensi';
import { uploadFile } from 'utils/fileUploadBucket';
import { formatDateString } from 'utils/formatDate';
import { startOfWeek, endOfWeek, format, parse } from 'date-fns';
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
      const currentDate = new Date().toLocaleDateString('id-ID').split('T')[0];

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
        time: date.toLocaleTimeString('id-ID'),
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
      const currentDate = new Date().toLocaleDateString('id-ID').split('T')[0];

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
        time: date.toLocaleTimeString('id-ID'),
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
      const currentDate = new Date().toLocaleDateString('id-ID').split('T')[0];

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
        if (isAlreadyCheckOut.kegiatan == 'izin') {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'presensi failed: dosen izin for today',
          };
        }
      }
      if (isAlreadyCheckOut == null) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'presensi failed: dosen not yet present',
        };
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
        time: date.toLocaleTimeString('id-ID'),
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
      const currentDate = new Date().toLocaleDateString('id-ID').split('T')[0];
      const date = new Date();

      const today = date.toLocaleDateString('id-ID', { weekday: 'long' });
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
      await this.prismaService.riwayatMasuk.create({
        data: {
          hari: today.toString(),
          jam: date.toLocaleTimeString('id-ID'),
          tanggal: `${currentDate}`,
          tipe: 'izin',
          nidn: dosesnAcc.nidn,
          kegiatan: 'izin',
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

  async getActivity(
    account: Account,
    filter: string,
    page: number = 1,
  ): Promise<GetActivityResponse> {
    try {
      const dosesnAcc = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
      });
      let dateFilter: any = {};
      const currentDate = new Date();
      const dayStart = new Date().toLocaleDateString('id-ID').split('T')[0];

      if (filter == 'daily') {
        dateFilter = {
          tanggal: dayStart,
        };
      } else if (filter === 'weekly') {
        // Weekly filter: Get all records for the current week
        const firstDayOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
        );
        const lastDayOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6),
        );
        dateFilter = {
          tanggal: {
            gte: firstDayOfWeek.toLocaleDateString('id-ID').split('T')[0], // Adjust date format if needed
            lte: lastDayOfWeek.toLocaleDateString('id-ID').split('T')[0], // Adjust date format if needed
          },
        };
      }

      const totalCount = await this.prismaService.riwayatMasuk.count({
        where: {
          nidn: dosesnAcc.nidn,
          ...dateFilter,
        },
      });
      const totalPages = Math.ceil(totalCount / 10);
      const activityDosen = await this.prismaService.riwayatMasuk.findMany({
        take: 10,
        skip: (page - 1) * 10,
        where: {
          nidn: dosesnAcc.nidn,
          ...dateFilter,
        },
        orderBy: [{ tanggal: 'desc' }, { jam: 'desc' }],
      });
      const data: Activity[] = activityDosen.map((activity) => ({
        activity: activity.kegiatan,
        date: `${activity.hari}, ${formatDateString(activity.tanggal)}`,
        location: activity.tipe,
        time: activity.jam,
      }));

      const PaginationData: PaginationData = {
        page,
        size: 10,
        totalData: totalCount,
        totalPage: totalPages,
      };
      return {
        data: data,
        pagination: PaginationData,
        message: 'success get log activity',
        statusCode: 200,
      };
    } catch (error) {
      return {
        data: [],
        message: `error: ${error}`,
        statusCode: 200,
      };
    }
  }
  getPerformance(totalTime: number): string {
    if (totalTime <= 10) return 'kurang';
    if (totalTime <= 20) return 'baik';
    return 'baik sekali';
  }

  parseTime = (timeString: string): Date => {
    const [hours, minutes, seconds] = timeString.split('.').map(Number);
    return new Date(1970, 0, 1, hours, minutes, seconds);
  };

  formatPeriod = (start: Date, end: Date): string => {
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  };
  calculateDuration = (startTime: Date, endTime: Date): number => {
    const diff = endTime.getTime() - startTime.getTime();
    return diff / 3600000; // Convert milliseconds to hours
  };
  async weeklyRecap(account: Account): Promise<WeeklyRecapResponse> {
    try {
      const dosesnAcc = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
      });

      const records = await this.prismaService.riwayatMasuk.findMany({
        where: {
          nidn: dosesnAcc.nidn,
        },
        orderBy: [{ tanggal: 'asc' }, { jam: 'asc' }],
      });
      console.log(records);

      const groupedByWeek: Record<string, typeof records> = records.reduce(
        (acc, record) => {
          const date = parse(record.tanggal, 'd/M/yyyy', new Date());
          const startOfWeekDate = startOfWeek(date);
          const endOfWeekDate = endOfWeek(date);
          const weekKey = this.formatPeriod(startOfWeekDate, endOfWeekDate);

          if (!acc[weekKey]) {
            acc[weekKey] = [];
          }

          acc[weekKey].push(record);
          return acc;
        },
        {} as Record<string, typeof records>,
      );
      console.log(groupedByWeek);

      const weeklyRecapData = Object.entries(groupedByWeek).map(
        ([weekKey, records]: [string, typeof records]) => {
          let totalTimeInHours = 0;

          for (let i = 0; i < records.length; i++) {
            if (
              records[i].kegiatan === 'masuk' &&
              records[i + 1] &&
              records[i + 1].kegiatan === 'keluar'
            ) {
              const startTime = this.parseTime(records[i].jam);
              const endTime = this.parseTime(records[i + 1].jam);
              totalTimeInHours += this.calculateDuration(startTime, endTime);
            }
          }

          const totalTime = totalTimeInHours.toFixed(2);
          const performance = this.getPerformance(parseFloat(totalTime));

          return {
            period: weekKey,
            totalTime,
            performance,
          };
        },
      );

      return {
        data: weeklyRecapData,
        statusCode: 200,
        message: 'Success',
      };
    } catch (error) {
      return {
        data: [],
        statusCode: 500,
        message: `Error ${error}`,
      };
    }
  }
}
