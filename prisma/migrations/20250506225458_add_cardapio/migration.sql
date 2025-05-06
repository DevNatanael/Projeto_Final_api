-- AlterTable
ALTER TABLE `menuitem` ADD COLUMN `cardapioId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Cardapio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_cardapioId_fkey` FOREIGN KEY (`cardapioId`) REFERENCES `Cardapio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
