/*
  Warnings:

  - You are about to drop the column `name` on the `guild` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `guild` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `guild` DROP COLUMN `name`,
    DROP COLUMN `password`,
    ADD COLUMN `azkar_channels` JSON NOT NULL;

-- CreateTable
CREATE TABLE `Audio` (
    `guildId` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NULL,
    `requestedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `Audio_guildId_key`(`guildId`),
    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quran` (
    `guildId` VARCHAR(191) NOT NULL,
    `reciter` VARCHAR(191) NULL,
    `surah` INTEGER NULL,
    `ayah` INTEGER NULL,

    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Guild_id_key` ON `Guild`(`id`);

-- AddForeignKey
ALTER TABLE `Audio` ADD CONSTRAINT `Audio_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Audio`(`guildId`) ON DELETE RESTRICT ON UPDATE CASCADE;
