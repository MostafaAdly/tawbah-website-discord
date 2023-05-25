/*
  Warnings:

  - The primary key for the `quranchannel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `quranchannel` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`guild_id`);
