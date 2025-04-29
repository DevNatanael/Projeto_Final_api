import prisma from "../config/database.js";

export const MenuRepository = {
  async create(data) {
    return prisma.menuItem.create({ data });
  },

  async update(id, data) {
    return prisma.menuItem.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.menuItem.delete({ where: { id } });
  },

  async getAll() {
    return prisma.menuItem.findMany();
  },

  async getById(id) {
    return prisma.menuItem.findUnique({ where: { id } });
  },
};
