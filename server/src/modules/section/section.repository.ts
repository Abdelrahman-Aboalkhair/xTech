import prisma from "@/infra/database/database.config";
import { Section } from "@prisma/client";

export class SectionRepository {
  async findAll() {
    return prisma.section.findMany();
  }

  async create(data: Section) {
    return prisma.section.create({ data });
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
