/*
  Warnings:

  - Made the column `audio_id` on table `guild` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` MODIFY `audio_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
