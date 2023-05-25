/*
  Warnings:

  - The primary key for the `quran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `qaudio_id` on the `quran` table. All the data in the column will be lost.
  - Added the required column `audio_id` to the `Quran` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_qaudio_id_fkey`;

-- AlterTable
ALTER TABLE `quran` DROP PRIMARY KEY,
    DROP COLUMN `qaudio_id`,
    ADD COLUMN `audio_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`audio_id`);

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
