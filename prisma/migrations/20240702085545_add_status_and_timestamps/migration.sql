-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    ADD COLUMN `status` ENUM('enable', 'disable', 'remove') NOT NULL DEFAULT 'enable',
    ADD COLUMN `updatedAt` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW();
