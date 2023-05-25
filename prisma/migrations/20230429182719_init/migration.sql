/*
  Warnings:

  - You are about to drop the column `id` on the `quran` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audio_id]` on the table `quran` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `quran_id_key` ON `quran`;

-- AlterTable
ALTER TABLE `quran` DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `quran_audio_id_key` ON `quran`(`audio_id`);
