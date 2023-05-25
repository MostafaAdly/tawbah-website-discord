/*
  Warnings:

  - Made the column `reciter` on table `quran` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `quran` MODIFY `reciter` JSON NOT NULL DEFAULT {};
