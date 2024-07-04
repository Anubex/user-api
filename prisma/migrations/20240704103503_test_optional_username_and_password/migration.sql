/*
  Warnings:

  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `defaultPassword` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
    ADD COLUMN `username` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW();

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
