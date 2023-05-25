-- CreateTable
CREATE TABLE `Guild` (
    `id` VARCHAR(191) NOT NULL,
    `azkar_channels` JSON NOT NULL,
    `gaudio_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Guild_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Audio` (
    `audio_absolute_id_ignored` INTEGER NOT NULL AUTO_INCREMENT,
    `audio_id` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NULL,
    `requested_by` VARCHAR(191) NULL,

    UNIQUE INDEX `Audio_audio_id_key`(`audio_id`),
    PRIMARY KEY (`audio_absolute_id_ignored`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quran` (
    `id` VARCHAR(191) NOT NULL,
    `reciter` JSON NULL,
    `surah` INTEGER NOT NULL DEFAULT 1,
    `ayah` INTEGER NULL DEFAULT 1,
    `qaudio_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Quran_id_key`(`id`),
    PRIMARY KEY (`qaudio_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuranChannel` (
    `id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QuranChannel_id_key`(`id`),
    PRIMARY KEY (`guild_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_gaudio_id_fkey` FOREIGN KEY (`gaudio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quran` ADD CONSTRAINT `Quran_qaudio_id_fkey` FOREIGN KEY (`qaudio_id`) REFERENCES `Audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuranChannel` ADD CONSTRAINT `QuranChannel_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
