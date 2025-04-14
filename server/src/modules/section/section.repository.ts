import prisma from "@/infra/database/database.config";

export class SectionRepository {
  async findAll() {
    return prisma.section.findMany();
  }

  async create(data: any) {
    return prisma.section.create({ data });
  }

  async findAllByPageId(pageId: number) {
    return prisma.section.findMany({
      where: { pageId },
    });
  }
  async findByPageSlug(slug: string) {
    return prisma.section.findMany({
      where: {
        page: { slug },
        isVisible: true,
      },
      orderBy: { order: "asc" },
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
