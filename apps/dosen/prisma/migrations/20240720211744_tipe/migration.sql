-- AlterTable
ALTER TABLE `RiwayatMasuk` MODIFY `kegiatan` ENUM('masuk', 'keluar', 'izin') NOT NULL,
    MODIFY `tipe` ENUM('online', 'offline', 'izin') NOT NULL;
