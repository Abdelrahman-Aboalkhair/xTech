import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { Request, Response } from "express";
import { PageService } from "./page.service";

export class PageController {
  constructor(private pageService: PageService) {}

  createPage = asyncHandler(async (req: Request, res: Response) => {
    const page = await this.pageService.createPage(req.body);
    sendResponse(res, 201, {
      data: page,
      message: "Page created successfully",
    });
  });

  getAllPages = asyncHandler(async (_req: Request, res: Response) => {
    const pages = await this.pageService.getAllPages();
    sendResponse(res, 200, {
      data: pages,
      message: "Pages fetched successfully",
    });
  });

  getPageById = asyncHandler(async (req: Request, res: Response) => {
    const page = await this.pageService.getPageById(Number(req.params.id));
    sendResponse(res, 200, {
      data: page,
      message: "Page fetched successfully",
    });
  });

  updatePage = asyncHandler(async (req: Request, res: Response) => {
    console.log("req.body => ", req.body);
    const updated = await this.pageService.updatePage(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, {
      data: { page: updated },
      message: "Page updated successfully",
    });
  });

  deletePage = asyncHandler(async (req: Request, res: Response) => {
    await this.pageService.deletePage(Number(req.params.id));
    sendResponse(res, 200, { message: "Page deleted successfully" });
  });
}
