import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ValidationService } from '../../common/validation.service';
import { Account } from '@prisma/client';
import {
  BaseResponse,
  JadwalDosen,
  JadwalDosenResponse,
  PaginationData,
  ProfileDosenRequest,
} from 'proto/profile';
import { DosenProfileValidation } from './dosen-profile.validate';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}
  async getProfile(account: Account): Promise<BaseResponse> {
    try {
      const dosenAccount = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: {},
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'get dosen profile success',
        data: {
          nidn: dosenAccount.dosen.nidn,
          nama: dosenAccount.dosen.nama,
          alamatSurel: dosenAccount.dosen.alamat_surel,
          jabatanAkademik: dosenAccount.dosen.jabatan_akademik,
          jenisKelamin: dosenAccount.dosen.jenis_kelamin,
          jenjangPendidikan: dosenAccount.dosen.jenjang_pendidikan,
          tanggalLahir: dosenAccount.dosen.tanggal_lahir.toISOString(),
          noTelephone: dosenAccount.dosen.no_telephone,
          programStudi: dosenAccount.dosen.program_studi,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `error:${error} `,
      };
    }
  }
  async updateProfile(
    account: Account,
    request: ProfileDosenRequest,
  ): Promise<BaseResponse> {
    try {
      const dosenAccount = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: {},
        },
      });

      const profileRequest: ProfileDosenRequest =
        this.validationService.validate(
          DosenProfileValidation.PROFILE_DOSEN,
          request,
        );

      await this.prismaService.dosen.update({
        where: {
          nidn: dosenAccount.nidn,
        },
        data: {
          nama: profileRequest.nama,
          program_studi: profileRequest.programStudi,
          jenjang_pendidikan: profileRequest.jenjangPendidikan,
          jenis_kelamin: profileRequest.jenisKelamin,
          tanggal_lahir: new Date(profileRequest.tanggalLahir),
          jabatan_akademik: profileRequest.jabatanAkademik,
          no_telephone: profileRequest.noTelephone,
          alamat_surel: profileRequest.alamatSurel,
        },
      });

      return {
        statusCode: 200,
        message: 'Biodata updated successfully',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `error:${error} `,
      };
    }
  }

  async getJadwalAll(
    account: Account,
    page: number = 1,
  ): Promise<JadwalDosenResponse> {
    try {
      const dosenAccount = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: {},
        },
      });
      const totalData = await this.prismaService.dosenJadwal.count({
        where: {
          dosen_id: dosenAccount.nidn,
        },
      });

      const data = await this.prismaService.dosenJadwal.findMany({
        take: 10,
        skip: (page - 1) * 10,
        where: {
          dosen_id: dosenAccount.nidn,
        },
        include: {
          jadwal: true,
        },
      });
      const totalPages = Math.ceil(totalData / 10);
      const pagination: PaginationData = {
        page,
        size: 10,
        totalData: totalData,
        totalPage: totalPages,
      };
      const semesterAktif = await this.prismaService.semesterAktif.findFirst({
        where: {
          status: 'active',
        },
      });

      const dataJadwal: JadwalDosen[] = data.map((jadwal) => ({
        mataKuliah: jadwal.jadwal.mata_kuliah,
        hari: jadwal.hari,
        semesterAktif: semesterAktif.semester,
        tahunAjaran: jadwal.jadwal.tahun_ajaran,
        kelas: jadwal.kelas,
      }));

      return {
        data: dataJadwal,
        pagination: pagination,
        message: 'succes get jadwal',
        statusCode: 200,
      };
    } catch (error) {
      return {
        data: [],
        message: `error: ${error}`,
        statusCode: 500,
      };
    }
  }

  async getJadwalDaily(
    account: Account,
    page: number = 1,
  ): Promise<JadwalDosenResponse> {
    try {
      const dosenAccount = await this.prismaService.dosenAccount.findFirst({
        where: {
          account_id: account.uuid,
        },
        include: {
          dosen: {},
        },
      });
      const date = new Date();

      const today = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const totalData = await this.prismaService.dosenJadwal.count({
        where: {
          AND: [{ dosen_id: dosenAccount.nidn }, { hari: today }],
        },
      });

      const data = await this.prismaService.dosenJadwal.findMany({
        take: 10,
        skip: (page - 1) * 10,
        where: {
          AND: [{ dosen_id: dosenAccount.nidn }, { hari: today }],
        },
        include: {
          jadwal: true,
        },
      });
      const totalPages = Math.ceil(totalData / 10);
      const pagination: PaginationData = {
        page,
        size: 10,
        totalData: totalData,
        totalPage: totalPages,
      };
      const semesterAktif = await this.prismaService.semesterAktif.findFirst({
        where: {
          status: 'active',
        },
      });

      const dataJadwal: JadwalDosen[] = data.map((jadwal) => ({
        mataKuliah: jadwal.jadwal.mata_kuliah,
        hari: jadwal.hari,
        semesterAktif: semesterAktif.semester,
        tahunAjaran: jadwal.jadwal.tahun_ajaran,
        kelas: jadwal.kelas,
      }));

      return {
        data: dataJadwal,
        pagination: pagination,
        message: 'succes get jadwal',
        statusCode: 200,
      };
    } catch (error) {
      return {
        data: [],
        message: `error: ${error}`,
        statusCode: 500,
      };
    }
  }
}
