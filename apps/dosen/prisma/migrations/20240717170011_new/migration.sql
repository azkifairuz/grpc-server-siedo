-- CreateTable
CREATE TABLE `Dosen` (
    `nidn` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `program_studi` VARCHAR(191) NOT NULL,
    `jenjang_pendidikan` VARCHAR(191) NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `jabatan_akademik` VARCHAR(191) NOT NULL,
    `no_telephone` VARCHAR(191) NOT NULL,
    `alamat_surel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`nidn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `uuid` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(255) NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DosenAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StafAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staf_id` INTEGER NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `instansi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendidikan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SemesterAktif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `semester` VARCHAR(191) NOT NULL,
    `tahun_ajar` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RiwayatMasuk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `jam` VARCHAR(191) NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `tanggal` VARCHAR(191) NOT NULL,
    `kegiatan` ENUM('masuk', 'keluar') NOT NULL,
    `tipe` ENUM('online', 'offline') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThriDarma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `jurnal` INTEGER NOT NULL,
    `pendidikan` INTEGER NOT NULL,
    `pkm` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mata_kuliah` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `tahun_ajaran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DosenJadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwal_id` INTEGER NOT NULL,
    `dosen_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Izin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `alasan` VARCHAR(191) NOT NULL,
    `bukti` VARCHAR(191) NOT NULL,
    `tanggal` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jurnal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `semesterAktif` INTEGER NOT NULL,
    `judul_artikel` VARCHAR(191) NOT NULL,
    `nama_jurnal` VARCHAR(191) NOT NULL,
    `tatuan_laman_jurnal` VARCHAR(191) NOT NULL,
    `tanggal_terbit` VARCHAR(191) NOT NULL,
    `volume` VARCHAR(191) NOT NULL,
    `nomor` VARCHAR(191) NOT NULL,
    `halaman` VARCHAR(191) NOT NULL,
    `penerbit_penyelanggara` VARCHAR(191) NOT NULL,
    `ISSN` VARCHAR(191) NOT NULL,
    `upload_document` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PKM` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `semesterAktif` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `tahun_pelaksanaan` VARCHAR(191) NOT NULL,
    `lama_kegiatan` VARCHAR(191) NOT NULL,
    `lokasi_kegiatan` VARCHAR(191) NOT NULL,
    `nomor_sk_pengesahan` VARCHAR(191) NOT NULL,
    `upload_document` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountRole` ADD CONSTRAINT `AccountRole_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountRole` ADD CONSTRAINT `AccountRole_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DosenAccount` ADD CONSTRAINT `DosenAccount_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DosenAccount` ADD CONSTRAINT `DosenAccount_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StafAccount` ADD CONSTRAINT `StafAccount_staf_id_fkey` FOREIGN KEY (`staf_id`) REFERENCES `Staf`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StafAccount` ADD CONSTRAINT `StafAccount_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RiwayatMasuk` ADD CONSTRAINT `RiwayatMasuk_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThriDarma` ADD CONSTRAINT `ThriDarma_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThriDarma` ADD CONSTRAINT `ThriDarma_pendidikan_fkey` FOREIGN KEY (`pendidikan`) REFERENCES `Pendidikan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThriDarma` ADD CONSTRAINT `ThriDarma_jurnal_fkey` FOREIGN KEY (`jurnal`) REFERENCES `Jurnal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThriDarma` ADD CONSTRAINT `ThriDarma_pkm_fkey` FOREIGN KEY (`pkm`) REFERENCES `PKM`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DosenJadwal` ADD CONSTRAINT `DosenJadwal_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `Jadwal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DosenJadwal` ADD CONSTRAINT `DosenJadwal_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Izin` ADD CONSTRAINT `Izin_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jurnal` ADD CONSTRAINT `Jurnal_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jurnal` ADD CONSTRAINT `Jurnal_semesterAktif_fkey` FOREIGN KEY (`semesterAktif`) REFERENCES `SemesterAktif`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PKM` ADD CONSTRAINT `PKM_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PKM` ADD CONSTRAINT `PKM_semesterAktif_fkey` FOREIGN KEY (`semesterAktif`) REFERENCES `SemesterAktif`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
