/*
  Warnings:

  - You are about to drop the column `Guild_id_key` on the `guild` table. All the data in the column will be lost.
  - You are about to drop the column `Quran_id_key` on the `quran` table. All the data in the column will be lost.
  - The primary key for the `quranchannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `QuranChannel_guild_id_key` on the `quranchannel` table. All the data in the column will be lost.
  - You are about to drop the column `QuranChannel_id_key` on the `quranchannel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Quran` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `QuranChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guild_id]` on the table `QuranChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Guild` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Quran` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `guild_id` to the `QuranChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `QuranChannel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quranchannel` DROP FOREIGN KEY `QuranChannel_guild_id_fkey`;

-- DropIndex
DROP INDEX `Guild_Guild_id_key_key` ON `guild`;

-- DropIndex
DROP INDEX `Quran_Quran_id_key_key` ON `quran`;

-- DropIndex
DROP INDEX `QuranChannel_QuranChannel_id_key_key` ON `quranchannel`;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `Guild_id_key`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `quran` DROP COLUMN `Quran_id_key`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quranchannel` DROP PRIMARY KEY,
    DROP COLUMN `QuranChannel_guild_id_key`,
    DROP COLUMN `QuranChannel_id_key`,
    ADD COLUMN `guild_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Guild_id_key` ON `Guild`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Quran_id_key` ON `Quran`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `QuranChannel_id_key` ON `QuranChannel`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `QuranChannel_guild_id_key` ON `QuranChannel`(`guild_id`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_gaudio_id_fkey` FOREIGN KEY (`gaudio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_qaudio_id_fkey` FOREIGN KEY (`qaudio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuranChannel` ADD CONSTRAINT `QuranChannel_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
