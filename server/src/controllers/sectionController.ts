import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import SectionService from "../services/sectionService";

class SectionController {
  constructor(private sectionService: SectionService) {}

  createSection = asyncHandler(async (req: Request, res: Response) => {
    const section = await this.sectionService.createSection(req.body);
    sendResponse(res, 201, { section }, "Section created successfully");
  });

  getSectionsByPageId = asyncHandler(async (req: Request, res: Response) => {
    const sections = await this.sectionService.getSectionsByPageId(
      Number(req.params.pageId)
    );
    sendResponse(res, 200, { sections }, "Sections fetched successfully");
  });

  getSectionById = asyncHandler(async (req: Request, res: Response) => {
    const section = await this.sectionService.getSectionById(
      Number(req.params.id)
    );
    sendResponse(res, 200, { section }, "Section fetched successfully");
  });

  updateSection = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.sectionService.updateSection(
      Number(req.params.id),
      req.body
    );
    sendResponse(
      res,
      200,
      { section: updated },
      "Section updated successfully"
    );
  });

  deleteSection = asyncHandler(async (req: Request, res: Response) => {
    await this.sectionService.deleteSection(Number(req.params.id));
    sendResponse(res, 200, {}, "Section deleted successfully");
  });
}

export default new SectionController(new SectionService());
