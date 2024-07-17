/*
  Warnings:

  - You are about to drop the column `kelas` on the `Jadwal` table. All the data in the column will be lost.
  - Added the required column `kelas` to the `DosenJadwal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DosenJadwal` ADD COLUMN `kelas` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Jadwal` DROP COLUMN `kelas`;
