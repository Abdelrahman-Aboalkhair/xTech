import AppError from "../utils/AppError";
import WidgetRepository from "../repositories/widgetRepository";

class WidgetService {
  private widgetRepository: WidgetRepository;

  constructor() {
    this.widgetRepository = new WidgetRepository();
  }
  async getHeroPromo() {
    return this.widgetRepository.findByLocation("hero");
  }

  async getTopbar() {
    return this.widgetRepository.findByLocation("topbar");
  }

  async createWidget(data: any) {
    return this.widgetRepository.create(data);
  }

  async getAllWidgets() {
    return this.widgetRepository.findAll();
  }

  async getWidgetById(id: number) {
    const widget = await this.widgetRepository.findById(id);
    if (!widget) throw new AppError(404, "Widget not found");
    return widget;
  }

  async updateWidget(id: number, data: any) {
    return this.widgetRepository.update(id, data);
  }

  async deleteWidget(id: number) {
    return this.widgetRepository.delete(id);
  }
}

export default WidgetService;
