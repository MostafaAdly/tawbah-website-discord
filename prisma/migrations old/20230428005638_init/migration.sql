/*
  Warnings:

  - The primary key for the `audio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `guildId` on the `audio` table. All the data in the column will be lost.
  - You are about to alter the column `reciter` on the `quran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - Made the column `surah` on table `quran` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `audio` DROP FOREIGN KEY `Audio_guildId_fkey`;

-- AlterTable
ALTER TABLE `audio` DROP PRIMARY KEY,
    DROP COLUMN `guildId`;

-- AlterTable
ALTER TABLE `guild` ADD COLUMN `audioId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `quran` MODIFY `reciter` JSON NULL,
    MODIFY `surah` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_id_fkey` FOREIGN KEY (`id`) REFERENCES `Audio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
