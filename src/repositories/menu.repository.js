import prisma from "../config/database.js";

export const MenuRepository = {
  async create(data) {
    return prisma.menuItem.create({
      data,
      include: {
        cardapio: true,
      },
    });
  },

  async update(id, data) {
    return prisma.menuItem.update({
      where: { id },
      data,
      include: {
        cardapio: true,
      },
    });
  },

  async delete(id) {
    return prisma.menuItem.delete({ where: { id } });
  },

  async getAll() {
    return prisma.menuItem.findMany({
      include: {
        cardapio: true,
      },
    });
  },

  async getById(id) {
    return prisma.menuItem.findUnique({
      where: { id },
      include: {
        cardapio: true,
      },
    });
  },

  async getByCardapio(cardapioId) {
    return prisma.menuItem.findMany({
      where: {
        cardapioId: cardapioId,
      },
      include: {
        cardapio: true,
      },
    });
  },

  async getCardapios() {
    return prisma.cardapio.findMany({
      include: {
        itens: true,
      },
    });
  },

  async getCardapioById(id) {
    return prisma.cardapio.findUnique({
      where: { id },
      include: {
        itens: true,
      },
    });
  },

  async createCardapio(data) {
    return prisma.cardapio.create({
      data,
      include: {
        itens: true,
      },
    });
  },

  async updateCardapio(id, data) {
    return prisma.cardapio.update({
      where: { id },
      data,
      include: {
        itens: true,
      },
    });
  },

  async deleteCardapio(id) {
    return prisma.cardapio.delete({
      where: { id },
    });
  },
};
