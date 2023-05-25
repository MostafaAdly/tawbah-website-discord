/*
  Warnings:

  - The primary key for the `audio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[audio_id]` on the table `Audio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Audio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audio` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Audio_audio_id_key` ON `Audio`(`audio_id`);
