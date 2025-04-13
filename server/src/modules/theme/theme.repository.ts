import prisma from "../config/database";

class ThemeRepository {
  async create(data: any) {
    return prisma.theme.create({ data });
  }

  async findAll() {
    return prisma.theme.findMany();
  }

  async findActive() {
    return prisma.theme.findFirst({
      where: { isActive: true },
    });
  }

  async update(id: number, data: any) {
    return prisma.theme.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.theme.delete({ where: { id } });
  }
}

export default ThemeRepository;
