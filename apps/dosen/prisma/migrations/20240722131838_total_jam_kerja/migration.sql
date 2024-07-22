-- CreateTable
CREATE TABLE `TotalJamKerjaDosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(191) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `totalJam` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TotalJamKerjaDosen` ADD CONSTRAINT `TotalJamKerjaDosen_nidn_fkey` FOREIGN KEY (`nidn`) REFERENCES `Dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;
