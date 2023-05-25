/*
  Warnings:

  - A unique constraint covering the columns `[QuranChannel_id_key]` on the table `QuranChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `quranchannel` ADD PRIMARY KEY (`QuranChannel_id_key`);

-- CreateIndex
CREATE UNIQUE INDEX `QuranChannel_QuranChannel_id_key_key` ON `QuranChannel`(`QuranChannel_id_key`);
