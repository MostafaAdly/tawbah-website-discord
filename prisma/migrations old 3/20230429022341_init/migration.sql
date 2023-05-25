/*
  Warnings:

  - You are about to drop the column `gaudio_id` on the `guild` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_gaudio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `gaudio_id`,
    ADD COLUMN `audio_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Guild_audio_id_fkey` ON `guild`(`audio_id`);

-- AddForeignKey
ALTER TABLE `guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `audio`(`audio_id`) ON DELETE SET NULL ON UPDATE CASCADE;
