import { Request, Response } from "express";
import { ThemeService } from "./theme.service";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
export class ThemeController {
  constructor(private themeService: ThemeService) {}

  createTheme = asyncHandler(async (req: Request, res: Response) => {
    const theme = await this.themeService.createTheme(req.body);
    sendResponse(res, 201, {
      data: theme,
      message: "Theme created successfully",
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
  });
}
