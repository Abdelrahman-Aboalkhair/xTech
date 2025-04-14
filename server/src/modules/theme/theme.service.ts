import AppError from "@/shared/errors/AppError";
import { ThemeRepository } from "./theme.repository";

export class ThemeService {
  constructor(private themeRepository: ThemeRepository) {}

  async createTheme(data: any) {
    return this.themeRepository.create(data);
  }

  async getAllThemes() {
    return this.themeRepository.findAll();
  }

  async getActiveTheme() {
    const theme = await this.themeRepository.findActive();
    if (!theme) throw new AppError(404, "No active theme found");
    return theme;
  }

  async updateTheme(id: number, data: any) {
    return this.themeRepository.update(id, data);
  }

  async deleteTheme(id: number) {
    return this.themeRepository.delete(id);
  }
}
