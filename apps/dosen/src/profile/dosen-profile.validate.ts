import { ZodType, z } from 'zod';

export class DosenProfileValidation {
  static readonly PROFILE_DOSEN: ZodType = z.object({
    nidn: z.string().min(3, 'NIDN tidak boleh kosong').max(100),
    nama: z
      .string()
      .min(1, 'Nama tidak boleh kosong')
      .max(255, 'Nama terlalu panjang'),
    programStudi: z
      .string()
      .min(1, 'Program Studi tidak boleh kosong')
      .max(255, 'Program Studi terlalu panjang'),
    jenjangPendidikan: z
      .string()
      .min(1, 'Jenjang Pendidikan tidak boleh kosong')
      .max(100, 'Jenjang Pendidikan terlalu panjang'),
    jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], {
      message: 'Jenis Kelamin Salah',
    }),
    tanggalLahir: z.preprocess(
      (arg) =>
        typeof arg === 'string' || arg instanceof Date ? new Date(arg) : null,
      z.date({
        invalid_type_error: 'Tanggal Lahir harus berupa tanggal yang valid',
      }),
    ),
    jabatanAkademik: z
      .string()
      .min(1, 'Jabatan Akademik tidak boleh kosong')
      .max(255, 'Jabatan Akademik terlalu panjang'),
    noTelephone: z
      .string()
      .min(1, 'Nomor Telepon tidak boleh kosong')
      .max(20, 'Nomor Telepon terlalu panjang'),
    alamatSurel: z.string().email('Alamat Surel tidak valid'),
  });
}
