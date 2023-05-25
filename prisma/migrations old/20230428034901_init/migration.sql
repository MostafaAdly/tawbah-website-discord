/*
  Warnings:

  - You are about to drop the column `requestedBy` on the `audio` table. All the data in the column will be lost.
  - You are about to drop the column `audioId` on the `guild` table. All the data in the column will be lost.
  - The primary key for the `quran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioId` on the `quran` table. All the data in the column will be lost.
  - Added the required column `audio_id` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - The required column `audio_id` was added to the `Quran` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audioId_fkey`;

-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_audioId_fkey`;

-- AlterTable
ALTER TABLE `audio` DROP COLUMN `requestedBy`,
    ADD COLUMN `requested_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `audioId`,
    ADD COLUMN `audio_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quran` DROP PRIMARY KEY,
    DROP COLUMN `audioId`,
    ADD COLUMN `audio_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`audio_id`);

-- CreateTable
CREATE TABLE `QuranChannel` (
    `id` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QuranChannel_id_key`(`id`),
    UNIQUE INDEX `QuranChannel_guild_id_key`(`guild_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuranChannel` ADD CONSTRAINT `QuranChannel_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
