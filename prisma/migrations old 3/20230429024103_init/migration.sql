-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_audio_id_fkey`;

-- AlterTable
ALTER TABLE `guild` MODIFY `Guild_audio_id_fkey` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `guild` ADD CONSTRAINT `Guild_audio_id_fkey` FOREIGN KEY (`Guild_audio_id_fkey`) REFERENCES `audio`(`audio_id`) ON DELETE SET NULL ON UPDATE CASCADE;
