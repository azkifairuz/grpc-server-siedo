/*
  Warnings:

  - You are about to drop the column `hari` on the `Jadwal` table. All the data in the column will be lost.
  - Added the required column `hari` to the `DosenJadwal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DosenJadwal` ADD COLUMN `hari` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Jadwal` DROP COLUMN `hari`;
