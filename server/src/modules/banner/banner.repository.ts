import prisma from "@/infra/database/database.config";

export class BannerRepository {
  async create(data: any) {
    return prisma.banner.create({ data });
  }

  async findAll() {
    return prisma.banner.findMany({
      include: {
        pages: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.banner.findUnique({
      where: { id },
      include: {
        pages: true,
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.banner.delete({ where: { id } });
  }
}
