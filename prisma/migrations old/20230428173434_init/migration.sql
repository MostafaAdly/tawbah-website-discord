/*
  Warnings:

  - The primary key for the `guild` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `guild` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`);
