/*
  Warnings:

  - A unique constraint covering the columns `[audio_id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Guild_audio_id_key` ON `Guild`(`audio_id`);
