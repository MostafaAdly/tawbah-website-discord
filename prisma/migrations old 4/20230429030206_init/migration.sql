/*
  Warnings:

  - You are about to drop the column `Guild_audio_id_fkey` on the `guild` table. All the data in the column will be lost.
  - Added the required column `audio_id` to the `guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quran` DROP FOREIGN KEY `Quran_audio_id_fkey`;

-- DropForeignKey
ALTER TABLE `quranchannel` DROP FOREIGN KEY `QuranChannel_guild_id_fkey`;

-- AlterTable
ALTER TABLE `audio` ADD COLUMN `connected_guilds` JSON NOT NULL;

-- AlterTable
ALTER TABLE `guild` DROP COLUMN `Guild_audio_id_fkey`,
    ADD COLUMN `audio_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `quran` ADD CONSTRAINT `quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quranchannel` ADD CONSTRAINT `quranchannel_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `audio_audio_id_key` ON `audio`(`audio_id`);
DROP INDEX `Audio_audio_id_key` ON `audio`;

-- RedefineIndex
CREATE UNIQUE INDEX `guild_id_key` ON `guild`(`id`);
DROP INDEX `Guild_id_key` ON `guild`;

-- RedefineIndex
CREATE UNIQUE INDEX `quran_id_key` ON `quran`(`id`);
DROP INDEX `Quran_id_key` ON `quran`;

-- RedefineIndex
CREATE UNIQUE INDEX `quranchannel_id_key` ON `quranchannel`(`id`);
DROP INDEX `QuranChannel_id_key` ON `quranchannel`;
