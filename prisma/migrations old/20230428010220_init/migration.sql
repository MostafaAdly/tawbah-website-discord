/*
  Warnings:

  - Made the column `audioId` on table `guild` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audioId_fkey`;

-- AlterTable
ALTER TABLE `guild` MODIFY `audioId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `Audio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
