import { ZodType, z } from 'zod';

export class PkmValidation {
  static readonly PKM_SCHEMA: ZodType = z.object({
    judul: z
      .string()
      .min(1, 'Judul tidak boleh kosong')
      .max(255, 'Judul terlalu panjang'),
    tahun_pelaksanaan: z
      .string()
      .min(4, 'Tahun Pelaksanaan tidak boleh kosong')
      .max(4, 'Tahun Pelaksanaan harus terdiri dari 4 karakter')
      .regex(
        /^\d{4}$/,
        'Tahun Pelaksanaan harus berupa angka tahun yang valid',
      ),
    lama_kegiatan: z
      .string()
      .min(1, 'Lama Kegiatan tidak boleh kosong')
      .max(50, 'Lama Kegiatan terlalu panjang'),
    lokasi_kegiatan: z
      .string()
      .min(1, 'Lokasi Kegiatan tidak boleh kosong')
      .max(255, 'Lokasi Kegiatan terlalu panjang'),
    nomor_sk_pengesahan: z
      .string()
      .min(1, 'Nomor SK Pengesahan tidak boleh kosong')
      .max(50, 'Nomor SK Pengesahan terlalu panjang'),
  });
}
