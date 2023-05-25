-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` MODIFY `gaudio_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`gaudio_id`) REFERENCES `Audio`(`audioId`) ON DELETE SET NULL ON UPDATE CASCADE;
