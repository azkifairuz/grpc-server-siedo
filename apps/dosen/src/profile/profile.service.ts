import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ValidationService } from '../../common/validation.service';
import { Account } from '@prisma/client';
import { BaseResponse, ProfileDosenRequest } from 'proto/profile';
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
}
