import { Request, Response } from "express";
import { ThemeService } from "./theme.service";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { makeLogsService } from "../logs/logs.factory";
export class ThemeController {
  private logsService = makeLogsService();
  constructor(private themeService: ThemeService) {}

  createTheme = asyncHandler(async (req: Request, res: Response) => {
    const theme = await this.themeService.createTheme(req.body);
    sendResponse(res, 201, {
      data: theme,
      message: "Theme created successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Theme created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  getAllThemes = asyncHandler(async (_req: Request, res: Response) => {
    const themes = await this.themeService.getAllThemes();
    sendResponse(res, 200, {
      data: themes,
      message: "Themes fetched successfully",
    });
  });

  getActiveTheme = asyncHandler(async (_req: Request, res: Response) => {
    const theme = await this.themeService.getActiveTheme();
    sendResponse(res, 200, {
      data: theme,
      message: "Theme fetched successfully",
    });
  });

  updateTheme = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.themeService.updateTheme(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, {
      data: { theme: updated },
      message: "Theme updated successfully",
    });
  });

  deleteTheme = asyncHandler(async (req: Request, res: Response) => {
    await this.themeService.deleteTheme(Number(req.params.id));
    sendResponse(res, 200, { message: "Theme deleted successfully" });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Theme deleted", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}
