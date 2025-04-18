import AppError from "@/shared/errors/AppError";
import { SectionRepository } from "./section.repository";
import { Section } from "@prisma/client";

export class SectionService {
  constructor(private sectionRepository: SectionRepository) {}

  async getAllSections() {
    return this.sectionRepository.findAll();
  }

  async createSection(data: Section) {
    return this.sectionRepository.create(data);
  }

  async getSectionById(id: number) {
    const section = await this.sectionRepository.findById(id);
    if (!section) throw new AppError(404, "Section not found");
    return section;
  }

  async updateSection(id: number, data: any) {
    return this.sectionRepository.update(id, data);
  }

  async deleteSection(id: number) {
    return this.sectionRepository.delete(id);
  }
}
