-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('User', 'Owner') NOT NULL DEFAULT 'User',
    `password` VARCHAR(191) NOT NULL,
    `refreshToken` TEXT NULL,
    `subscription` JSON NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavFood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `place` VARCHAR(191) NULL,
    `ffoodname` VARCHAR(191) NULL,
    `fplacename` VARCHAR(191) NULL,
    `ffoodtype` VARCHAR(191) NULL,
    `notified` VARCHAR(191) NULL DEFAULT 'not yet',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Places` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `imagepath` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Places_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Special` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `poster` VARCHAR(191) NOT NULL DEFAULT 'beforetime',
    `foodorgroc` ENUM('Food', 'Groc', 'Both') NOT NULL,
    `imagepath` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `till` VARCHAR(191) NOT NULL,
    `before` DOUBLE NOT NULL,
    `after` DOUBLE NOT NULL,
    `placesId` INTEGER NOT NULL,
    `PlaceName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_foodbyname` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_foodbyname_AB_unique`(`A`, `B`),
    INDEX `_foodbyname_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_placebyname` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_placebyname_AB_unique`(`A`, `B`),
    INDEX `_placebyname_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_favbytype` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_favbytype_AB_unique`(`A`, `B`),
    INDEX `_favbytype_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavFood` ADD CONSTRAINT `FavFood_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Special` ADD CONSTRAINT `Special_placesId_fkey` FOREIGN KEY (`placesId`) REFERENCES `Places`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Special` ADD CONSTRAINT `Special_PlaceName_fkey` FOREIGN KEY (`PlaceName`) REFERENCES `Places`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_foodbyname` ADD CONSTRAINT `_foodbyname_A_fkey` FOREIGN KEY (`A`) REFERENCES `FavFood`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_foodbyname` ADD CONSTRAINT `_foodbyname_B_fkey` FOREIGN KEY (`B`) REFERENCES `Special`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_placebyname` ADD CONSTRAINT `_placebyname_A_fkey` FOREIGN KEY (`A`) REFERENCES `FavFood`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_placebyname` ADD CONSTRAINT `_placebyname_B_fkey` FOREIGN KEY (`B`) REFERENCES `Special`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_favbytype` ADD CONSTRAINT `_favbytype_A_fkey` FOREIGN KEY (`A`) REFERENCES `FavFood`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_favbytype` ADD CONSTRAINT `_favbytype_B_fkey` FOREIGN KEY (`B`) REFERENCES `Special`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
