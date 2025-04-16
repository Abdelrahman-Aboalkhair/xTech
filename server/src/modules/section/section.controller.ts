import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { SectionService } from "./section.service";
import { makeLogsService } from "../logs/logs.factory";

export class SectionController {
  private logsService = makeLogsService();
  constructor(private sectionService: SectionService) {}

  getAllSections = asyncHandler(async (_req: Request, res: Response) => {
    const sections = await this.sectionService.getAllSections();
    sendResponse(res, 200, {
      data: sections,
      message: "Sections fetched successfully",
    });
  });

  createSection = asyncHandler(async (req: Request, res: Response) => {
    const section = await this.sectionService.createSection(req.body);
    sendResponse(res, 201, {
      data: section,
      message: "Section created successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Section created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  getSectionsByPageId = asyncHandler(async (req: Request, res: Response) => {
    const sections = await this.sectionService.getSectionsByPageId(
      Number(req.params.pageId)
    );
    sendResponse(res, 200, {
      data: sections,
      message: "Sections fetched successfully",
    });
  });

  getSectionsByPageSlug = asyncHandler(async (req: Request, res: Response) => {
    console.log("slug => ", req.params.slug);
    const sections = await this.sectionService.getSectionsByPageSlug(
      req.params.slug
    );
    sendResponse(res, 200, {
      data: sections,
      message: "Sections fetched successfully",
    });
  });

  getSectionById = asyncHandler(async (req: Request, res: Response) => {
    const section = await this.sectionService.getSectionById(
      Number(req.params.id)
    );
    sendResponse(res, 200, {
      data: section,
      message: "Section fetched successfully",
    });
  });

  updateSection = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.sectionService.updateSection(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, {
      data: { updated },
      message: "Section updated successfully",
    });

    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Section updated", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  deleteSection = asyncHandler(async (req: Request, res: Response) => {
    await this.sectionService.deleteSection(Number(req.params.id));
    sendResponse(res, 200, { message: "Section deleted successfully" });

    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Section deleted", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}
