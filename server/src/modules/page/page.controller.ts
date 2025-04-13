import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import PageService from "../services/pageService";

class PageController {
  constructor(private pageService: PageService) {}

  createPage = asyncHandler(async (req: Request, res: Response) => {
    const page = await this.pageService.createPage(req.body);
    sendResponse(res, 201, { page }, "Page created successfully");
  });

  getAllPages = asyncHandler(async (_req: Request, res: Response) => {
    const pages = await this.pageService.getAllPages();
    sendResponse(res, 200, { pages }, "Pages fetched successfully");
  });

  getPageById = asyncHandler(async (req: Request, res: Response) => {
    const page = await this.pageService.getPageById(Number(req.params.id));
    sendResponse(res, 200, { page }, "Page fetched successfully");
  });

  updatePage = asyncHandler(async (req: Request, res: Response) => {
    console.log("req.body => ", req.body);
    const updated = await this.pageService.updatePage(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, { page: updated }, "Page updated successfully");
  });

  deletePage = asyncHandler(async (req: Request, res: Response) => {
    await this.pageService.deletePage(Number(req.params.id));
    sendResponse(res, 200, {}, "Page deleted successfully");
  });
}

export default new PageController(new PageService());
