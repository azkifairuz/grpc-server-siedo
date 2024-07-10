import { Injectable } from '@nestjs/common';
import { BaseResponse, DosenLoginRequest } from 'proto/auth';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class DosenService {
  constructor(private prismaService: PrismaService) {}
  async loginDosen(request: DosenLoginRequest): Promise<BaseResponse> {
    try {
      const dosen = await this.prismaService.dosenAccount.findFirst({
        where: {
          nidn: request.nidn,
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
        request.password,
        dosen.account.password,
      );
      if (!isPasswordValid) {
        return {
          statusCode: 404,
          message: 'username or password',
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
