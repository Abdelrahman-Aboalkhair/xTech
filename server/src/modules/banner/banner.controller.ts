import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { BannerService } from "./banner.service";
import { makeLogsService } from "../logs/logs.factory";

export class BannerController {
  private logsService = makeLogsService();
  constructor(private bannerService: BannerService) {}

  createBanner = asyncHandler(async (req: Request, res: Response) => {
    const banner = await this.bannerService.createBanner(req.body);
    sendResponse(res, 201, {
      data: banner,
      message: "Banner created successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Banner created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  getAllBanners = asyncHandler(async (_req: Request, res: Response) => {
    const banners = await this.bannerService.getAllBanners();
    sendResponse(res, 200, {
      data: banners,
      message: "Banners fetched successfully",
    });
  });

  getBannerById = asyncHandler(async (req: Request, res: Response) => {
    const banner = await this.bannerService.getBannerById(
      Number(req.params.id)
    );
    sendResponse(res, 200, {
      data: banner,
      message: "Banner fetched successfully",
    });
  });

  updateBanner = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.bannerService.updateBanner(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, {
      data: updated,
      message: "Banner updated successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Banner updated", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  deleteBanner = asyncHandler(async (req: Request, res: Response) => {
    await this.bannerService.deleteBanner(Number(req.params.id));
    sendResponse(res, 200, { message: "Banner deleted successfully" });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Banner deleted", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}
