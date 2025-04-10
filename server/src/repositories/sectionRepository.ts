import prisma from "../config/database";

class SectionRepository {
  async create(data: any) {
    return prisma.section.create({ data });
  }

  async findAllByPageId(pageId: number) {
    return prisma.section.findMany({
      where: { pageId },
    });
  }

  async findById(id: number) {
    return prisma.section.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return prisma.section.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.section.delete({ where: { id } });
  }
}

export default SectionRepository;
