import { Router } from "express";
import bannerController from "../controllers/bannerController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
// import { validateDto } from "../middlewares/validateDto";
// import { CreateBannerDto, UpdateBannerDto, BannerIdDto } from "../dtos/bannerDto";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(CreateBannerDto),
  bannerController.createBanner
);

router.get(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  bannerController.getAllBanners
);

router.get(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(BannerIdDto),
  bannerController.getBannerById
);

router.put(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(UpdateBannerDto),
  bannerController.updateBanner
);

router.delete(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(BannerIdDto),
  bannerController.deleteBanner
);

export default router;
