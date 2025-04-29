-- CreateTable
CREATE TABLE `MenuItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `valor` DOUBLE NULL,
    `valorPromocional` DOUBLE NULL,
    `tipoComplemento` VARCHAR(191) NULL,
    `qtdMinima` INTEGER NULL,
    `qtdMaxima` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
