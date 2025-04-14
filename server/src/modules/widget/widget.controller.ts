import { Request, Response } from "express";
import { WidgetService } from "./widget.service";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";

export class WidgetController {
  constructor(private widgetService: WidgetService) {}

  getHeroPromo = asyncHandler(async (req: Request, res: Response) => {
    const widgets = await this.widgetService.getHeroPromo();
    if (!widgets.length) {
      sendResponse(res, 404, { message: "Hero Promo not found" });
    }
    sendResponse(res, 200, {
      data: widgets,
      message: "Hero Promo fetched successfully",
    });
  });

  getTopbar = asyncHandler(async (req: Request, res: Response) => {
    const widgets = await this.widgetService.getTopbar();
    if (!widgets.length) {
      sendResponse(res, 404, { message: "Topbar not found" });
    }
    sendResponse(res, 200, {
      data: widgets,
      message: "Topbar fetched successfully",
    });
  });

  createWidget = asyncHandler(async (req: Request, res: Response) => {
    const widget = await this.widgetService.createWidget(req.body);
    sendResponse(res, 201, {
      data: widget,
      message: "Widget created successfully",
    });
  });

  getAllWidgets = asyncHandler(async (_req: Request, res: Response) => {
    const widgets = await this.widgetService.getAllWidgets();
    sendResponse(res, 200, {
      data: widgets,
      message: "Widgets fetched successfully",
    });
  });

  getWidgetById = asyncHandler(async (req: Request, res: Response) => {
    const widget = await this.widgetService.getWidgetById(
      Number(req.params.id)
    );
    sendResponse(res, 200, {
      data: widget,
      message: "Widget fetched successfully",
    });
  });

  updateWidget = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.widgetService.updateWidget(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, {
      data: { widget: updated },
      message: "Widget updated successfully",
    });
  });

  deleteWidget = asyncHandler(async (req: Request, res: Response) => {
    await this.widgetService.deleteWidget(Number(req.params.id));
    sendResponse(res, 200, { message: "Widget deleted successfully" });
  });
}
