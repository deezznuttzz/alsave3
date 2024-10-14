-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('User', 'Owner', 'Admin') NOT NULL DEFAULT 'User';
