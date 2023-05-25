-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` MODIFY `audio_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE SET NULL ON UPDATE CASCADE;
