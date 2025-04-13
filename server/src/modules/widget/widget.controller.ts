import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import WidgetService from "../services/widgetService";

class WidgetController {
  constructor(private widgetService: WidgetService) {}

  getHeroPromo = asyncHandler(async (req: Request, res: Response) => {
    const widgets = await this.widgetService.getHeroPromo();
    if (!widgets.length) {
      sendResponse(res, 404, {}, "Hero Promo not found");
    }
    sendResponse(res, 200, { widgets }, "Hero Promo fetched successfully");
  });

  getTopbar = asyncHandler(async (req: Request, res: Response) => {
    const widgets = await this.widgetService.getTopbar();
    if (!widgets.length) {
      sendResponse(res, 404, {}, "Topbar not found");
    }
    sendResponse(res, 200, { widgets }, "Topbar fetched successfully");
  });

  createWidget = asyncHandler(async (req: Request, res: Response) => {
    const widget = await this.widgetService.createWidget(req.body);
    sendResponse(res, 201, { widget }, "Widget created successfully");
  });

  getAllWidgets = asyncHandler(async (_req: Request, res: Response) => {
    const widgets = await this.widgetService.getAllWidgets();
    sendResponse(res, 200, { widgets }, "Widgets fetched successfully");
  });

  getWidgetById = asyncHandler(async (req: Request, res: Response) => {
    const widget = await this.widgetService.getWidgetById(
      Number(req.params.id)
    );
    sendResponse(res, 200, { widget }, "Widget fetched successfully");
  });

  updateWidget = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.widgetService.updateWidget(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, { widget: updated }, "Widget updated successfully");
  });

  deleteWidget = asyncHandler(async (req: Request, res: Response) => {
    await this.widgetService.deleteWidget(Number(req.params.id));
    sendResponse(res, 200, {}, "Widget deleted successfully");
  });
}

export default new WidgetController(new WidgetService());
