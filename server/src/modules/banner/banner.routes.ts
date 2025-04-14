import { Router } from "express";
import { makeBannerController } from "./banner.factory";

const router = Router();
const bannerController = makeBannerController();

router.get("/", bannerController.getAllBanners);

router.post("/", bannerController.createBanner);

router.get("/:id", bannerController.getBannerById);

router.put("/:id", bannerController.updateBanner);

router.delete("/:id", bannerController.deleteBanner);

export default router;
