import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import BannerService from "../services/bannerService";

class BannerController {
  constructor(private bannerService: BannerService) {}

  createBanner = asyncHandler(async (req: Request, res: Response) => {
    const banner = await this.bannerService.createBanner(req.body);
    sendResponse(res, 201, { banner }, "Banner created successfully");
  });

  getAllBanners = asyncHandler(async (_req: Request, res: Response) => {
    const banners = await this.bannerService.getAllBanners();
    sendResponse(res, 200, { banners }, "Banners fetched successfully");
  });

  getBannerById = asyncHandler(async (req: Request, res: Response) => {
    const banner = await this.bannerService.getBannerById(
      Number(req.params.id)
    );
    sendResponse(res, 200, { banner }, "Banner fetched successfully");
  });

  updateBanner = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.bannerService.updateBanner(
      Number(req.params.id),
      req.body
    );
    sendResponse(res, 200, { banner: updated }, "Banner updated successfully");
  });

  deleteBanner = asyncHandler(async (req: Request, res: Response) => {
    await this.bannerService.deleteBanner(Number(req.params.id));
    sendResponse(res, 200, {}, "Banner deleted successfully");
  });
}

export default new BannerController(new BannerService());
