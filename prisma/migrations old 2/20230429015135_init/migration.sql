/*
  Warnings:

  - You are about to drop the column `resource` on the `audio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `audio` DROP COLUMN `resource`,
    ADD COLUMN `resource_path` VARCHAR(191) NULL;
