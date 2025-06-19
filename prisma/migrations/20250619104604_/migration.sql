/*
  Warnings:

  - You are about to drop the column `image` on the `facility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `facility` DROP COLUMN `image`,
    ADD COLUMN `images` JSON NULL;
