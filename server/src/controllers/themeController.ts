import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import ThemeService from "../services/themeService";

class ThemeController {
  constructor(private themeService: ThemeService) {}

  createTheme = asyncHandler(async (req: Request, res: Response) => {
    const theme = await this.themeService.createTheme(req.body);
    sendResponse(res, 201, { theme }, "Theme created successfully");
  });

  getAllThemes = asyncHandler(async (_req: Request, res: Response) => {
    const themes = await this.themeService.getAllThemes();
    sendResponse(res, 200, { themes }, "Themes fetched successfully");
  });

  getActiveTheme = asyncHandler(async (_req: Request, res: Response) => {
    const theme = await this.themeService.getActiveTheme();
    sendResponse(res, 200, { theme }, "Active theme fetched successfully");
  });

  updateTheme = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.themeService.updateTheme(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, { theme: updated }, "Theme updated successfully");
  });

  deleteTheme = asyncHandler(async (req: Request, res: Response) => {
    await this.themeService.deleteTheme(Number(req.params.id));
    sendResponse(res, 200, {}, "Theme deleted successfully");
  });
}

export default new ThemeController(new ThemeService());
