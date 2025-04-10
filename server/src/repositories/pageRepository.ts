import prisma from "../config/database";

class PageRepository {
  async create(data: any) {
    return prisma.page.create({ data });
  }

  async findAll() {
    return prisma.page.findMany({
      include: {
        sections: true,
        banners: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.page.findUnique({
      where: { id },
      include: {
        sections: true,
        banners: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.page.findUnique({
      where: { slug },
      include: {
        sections: true,
        banners: true,
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.page.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.page.delete({ where: { id } });
  }
}

export default PageRepository;
