-- CreateTable
CREATE TABLE `audio` (
    `audio_absolute_id_ignored` INTEGER NOT NULL AUTO_INCREMENT,
    `audio_id` VARCHAR(191) NOT NULL,
    `resource_path` VARCHAR(191) NULL,
    `requested_by` VARCHAR(191) NULL,
    `connected_guilds` JSON NOT NULL,

    UNIQUE INDEX `audio_audio_id_key`(`audio_id`),
    PRIMARY KEY (`audio_absolute_id_ignored`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild` (
    `id` VARCHAR(191) NOT NULL,
    `azkar_channels` JSON NOT NULL,
    `audio_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `guild_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quran` (
    `id` VARCHAR(191) NOT NULL,
    `reciter` JSON NOT NULL,
    `surah` INTEGER NOT NULL DEFAULT 1,
    `ayah` INTEGER NULL DEFAULT 1,
    `audio_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `quran_id_key`(`id`),
    PRIMARY KEY (`audio_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quranchannel` (
    `id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `quranchannel_id_key`(`id`),
    PRIMARY KEY (`guild_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quran` ADD CONSTRAINT `quran_audio_id_fkey` FOREIGN KEY (`audio_id`) REFERENCES `audio`(`audio_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quranchannel` ADD CONSTRAINT `quranchannel_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
