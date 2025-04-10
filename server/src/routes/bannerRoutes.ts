import { Router } from "express";
import bannerController from "../controllers/bannerController";

const router = Router();

router.get("/", bannerController.getAllBanners);

router.post("/", bannerController.createBanner);

router.get("/:id", bannerController.getBannerById);

router.put("/:id", bannerController.updateBanner);

router.delete("/:id", bannerController.deleteBanner);

export default router;
