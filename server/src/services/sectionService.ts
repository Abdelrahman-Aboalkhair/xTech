import AppError from "../utils/AppError";
import SectionRepository from "../repositories/sectionRepository";

class SectionService {
  private sectionRepository: SectionRepository;

  constructor() {
    this.sectionRepository = new SectionRepository();
  }

  async getAllSections() {
    return this.sectionRepository.findAll();
  }

  async createSection(data: any) {
    return this.sectionRepository.create(data);
  }

  async getSectionsByPageId(pageId: number) {
    return this.sectionRepository.findAllByPageId(pageId);
  }
  async getSectionsByPageSlug(slug: string) {
    return this.sectionRepository.findByPageSlug(slug);
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

export default SectionService;
