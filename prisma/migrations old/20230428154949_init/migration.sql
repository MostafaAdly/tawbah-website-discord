/*
  Warnings:

  - The primary key for the `audio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioId` on the `audio` table. All the data in the column will be lost.
  - You are about to drop the column `gaudio_id` on the `guild` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audio_id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - The required column `audio_id` was added to the `Audio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_audio_id_fkey`;

-- AlterTable
ALTER TABLE `audio` DROP PRIMARY KEY,
    DROP COLUMN `audioId`,
    ADD COLUMN `audio_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`audio_id`);

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `gaudio_id`,
    ADD COLUMN `audio_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Guild_audio_id_key` ON `Guild`(`audio_id`);

-- CreateIndex
CREATE INDEX `Guild_audio_id_fkey` ON `Guild`(`audio_id`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
