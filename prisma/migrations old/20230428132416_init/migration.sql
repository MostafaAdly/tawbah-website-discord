/*
  Warnings:

  - You are about to drop the column `id` on the `audio` table. All the data in the column will be lost.
  - The required column `audio_id` was added to the `Audio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_audio_id_fkey`;

-- DropIndex
DROP INDEX `Audio_id_key` ON `audio`;

-- AlterTable
ALTER TABLE `audio` DROP COLUMN `id`,
    ADD COLUMN `audio_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`audio_id`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
