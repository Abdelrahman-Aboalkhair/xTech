import prisma from "../config/database";

class WidgetRepository {
  async findByLocation(location: string) {
    return prisma.widget.findMany({
      where: { location, isVisible: true },
      orderBy: { order: "asc" },
    });
  }
  async create(data: any) {
    return prisma.widget.create({ data });
  }

  async findAll() {
    return prisma.widget.findMany();
  }

  async findById(id: number) {
    return prisma.widget.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return prisma.widget.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.widget.delete({ where: { id } });
  }
}

export default WidgetRepository;
