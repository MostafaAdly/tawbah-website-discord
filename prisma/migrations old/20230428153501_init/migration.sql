/*
  Warnings:

  - You are about to drop the column `audio_id` on the `guild` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gaudio_id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gaudio_id` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `audio_id`,
    ADD COLUMN `gaudio_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Guild_gaudio_id_key` ON `Guild`(`gaudio_id`);

-- CreateIndex
CREATE INDEX `Guild_audio_id_fkey` ON `Guild`(`gaudio_id`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`gaudio_id`) REFERENCES `Audio`(`audioId`) ON DELETE RESTRICT ON UPDATE CASCADE;
