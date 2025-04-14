import AppError from "@/shared/errors/AppError";
import { PageRepository } from "./page.repository";

export class PageService {
  constructor(private pageRepository: PageRepository) {}

  async createPage(data: any) {
    return this.pageRepository.create(data);
  }

  async getAllPages() {
    return this.pageRepository.findAll();
  }

  async getPageById(id: number) {
    const page = await this.pageRepository.findById(id);
    if (!page) throw new AppError(404, "Page not found");
    return page;
  }

  async updatePage(id: number, data: any) {
    return this.pageRepository.update(id, data);
  }

  async deletePage(id: number) {
    return this.pageRepository.delete(id);
  }
}
