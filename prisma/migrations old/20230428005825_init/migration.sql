-- DropForeignKey
ALTER TABLE `guild` DROP FOREIGN KEY `Guild_id_fkey`;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `Audio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
