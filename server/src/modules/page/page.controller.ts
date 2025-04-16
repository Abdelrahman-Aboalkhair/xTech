import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { Request, Response } from "express";
import { PageService } from "./page.service";
import { makeLogsService } from "../logs/logs.factory";

export class PageController {
  private logsService = makeLogsService();
  constructor(private pageService: PageService) {}

  createPage = asyncHandler(async (req: Request, res: Response) => {
    const page = await this.pageService.createPage(req.body);
    sendResponse(res, 201, {
      data: page,
      message: "Page created successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Page created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
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
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Page updated", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  deletePage = asyncHandler(async (req: Request, res: Response) => {
    await this.pageService.deletePage(Number(req.params.id));
    sendResponse(res, 200, { message: "Page deleted successfully" });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Page deleted", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}
