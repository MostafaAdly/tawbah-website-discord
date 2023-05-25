/*
  Warnings:

  - You are about to drop the column `id` on the `guild` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `quran` table. All the data in the column will be lost.
  - You are about to drop the column `guild_id` on the `quranchannel` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `quranchannel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Guild_id_key]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Quran_id_key]` on the table `Quran` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[QuranChannel_id_key]` on the table `QuranChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[QuranChannel_guild_id_key]` on the table `QuranChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Guild_id_key` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - The required column `Quran_id_key` was added to the `Quran` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `QuranChannel_guild_id_key` to the `QuranChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `QuranChannel_id_key` to the `QuranChannel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quranchannel` DROP FOREIGN KEY `QuranChannel_guild_id_fkey`;

-- DropIndex
DROP INDEX `Guild_id_key` ON `guild`;

-- DropIndex
DROP INDEX `Quran_id_key` ON `quran`;

-- DropIndex
DROP INDEX `QuranChannel_id_key` ON `quranchannel`;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `id`,
    ADD COLUMN `Guild_id_key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quran` DROP COLUMN `id`,
    ADD COLUMN `Quran_id_key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quranchannel` DROP COLUMN `guild_id`,
    DROP COLUMN `id`,
    ADD COLUMN `QuranChannel_guild_id_key` VARCHAR(191) NOT NULL,
    ADD COLUMN `QuranChannel_id_key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Guild_Guild_id_key_key` ON `Guild`(`Guild_id_key`);

-- CreateIndex
CREATE INDEX `Guild_audio_id_fkey` ON `Guild`(`audio_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Quran_Quran_id_key_key` ON `Quran`(`Quran_id_key`);

-- CreateIndex
CREATE UNIQUE INDEX `QuranChannel_QuranChannel_id_key_key` ON `QuranChannel`(`QuranChannel_id_key`);

-- CreateIndex
CREATE UNIQUE INDEX `QuranChannel_QuranChannel_guild_id_key_key` ON `QuranChannel`(`QuranChannel_guild_id_key`);

-- AddForeignKey
ALTER TABLE `QuranChannel` ADD CONSTRAINT `QuranChannel_guild_id_fkey` FOREIGN KEY (`QuranChannel_guild_id_key`) REFERENCES `Guild`(`Guild_id_key`) ON DELETE RESTRICT ON UPDATE CASCADE;
