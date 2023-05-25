/*
  Warnings:

  - You are about to drop the column `audio_id` on the `guild` table. All the data in the column will be lost.
  - Added the required column `Guild_audio_id_fkey` to the `guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `audio_id`,
    ADD COLUMN `Guild_audio_id_fkey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Guild_audio_id_fkey` ON `guild`(`Guild_audio_id_fkey`);

-- AddForeignKey
ALTER TABLE `guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`Guild_audio_id_fkey`) REFERENCES `audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
