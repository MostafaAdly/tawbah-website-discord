/*
  Warnings:

  - The primary key for the `audio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audio_id` on the `audio` table. All the data in the column will be lost.
  - The required column `audioId` was added to the `Audio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_audio_id_fkey`;

-- AlterTable
ALTER TABLE `audio` DROP PRIMARY KEY,
    DROP COLUMN `audio_id`,
    ADD COLUMN `audioId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`audioId`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audioId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audioId`) ON DELETE RESTRICT ON UPDATE CASCADE;
