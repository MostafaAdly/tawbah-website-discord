/*
  Warnings:

  - The primary key for the `guild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `gaudio_id` on table `guild` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_gaudio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` DROP PRIMARY KEY,
    MODIFY `gaudio_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`gaudio_id`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_gaudio_id_fkey` FOREIGN KEY (`gaudio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
