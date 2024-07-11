import { ZodType, z } from 'zod';

export class AuthDosenValidation {
  static readonly LOGIN_DOSEN: ZodType = z.object({
    nidn: z.string().min(3, 'nidn tidak boleh kosong').max(100),
    password: z.string().min(1, 'password tidak boleh kosong').max(100),
  });
}
