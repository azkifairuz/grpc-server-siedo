import { Injectable } from '@nestjs/common';
import { BaseResponse, DosenLoginRequest } from 'proto/auth';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ValidationService } from '../../common/validation.service';
import { AuthDosenValidation } from './auth-dosen.validate';
@Injectable()
export class AuthDosenService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}
  async loginDosen(request: DosenLoginRequest): Promise<BaseResponse> {
    try {
      const dosenLoginRequest: DosenLoginRequest =
        this.validationService.validate(
          AuthDosenValidation.LOGIN_DOSEN,
          request,
        );
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          nidn: dosenLoginRequest.nidn,
        },
        include: {
          account: {
            select: {
              password: true,
              uuid: true,
            },
          },
        },
      });

      if (!dosen) {
        return {
          statusCode: 404,
          message: 'account not found',
        };
      }
      const isPasswordValid = await bcrypt.compare(
        dosenLoginRequest.password,
        dosen.account.password,
      );
      if (!isPasswordValid) {
        return {
          statusCode: 404,
          message: 'username or password not valid',
        };
      }
      const secretKey = process.env.JWT_KEY;
      const token = jwt.sign(
        {
          nidn: dosen.nidn,
          dosen_id: dosen.account_id,
        },
        secretKey,
        {
          expiresIn: '365d',
        },
      );

      await this.prismaService.account.update({
        where: {
          uuid: dosen.account_id,
        },
        data: {
          token: token,
        },
      });

      return {
        data: {
          nidn: dosen.nidn,
          token: token,
        },
        statusCode: 200,
        message: 'login success',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `server error: ${error}`,
      };
    }
  }
}
