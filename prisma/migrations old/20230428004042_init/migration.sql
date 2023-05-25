/*
  Warnings:

  - The primary key for the `guild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `quran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `guildId` on the `quran` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Audio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Quran` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Audio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `audioId` was added to the `Quran` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Quran` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_guildId_fkey`;

-- AlterTable
ALTER TABLE `audio` ADD COLUMN `id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `guild` DROP PRIMARY KEY;

-- AlterTable
ALTER TABLE `quran` DROP PRIMARY KEY,
    DROP COLUMN `guildId`,
    ADD COLUMN `audioId` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`audioId`);

-- CreateIndex
CREATE UNIQUE INDEX `Audio_id_key` ON `Audio`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Quran_id_key` ON `Quran`(`id`);

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `Audio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
