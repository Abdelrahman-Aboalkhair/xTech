import { Router } from "express";
import pageController from "../controllers/pageController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
import { validateDto } from "../middlewares/validateDto";
// import { CreatePageDto, UpdatePageDto, PageIdDto } from "../dtos/pageDto";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(CreatePageDto),
  pageController.createPage
);

router.get(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  pageController.getAllPages
);

router.get(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(PageIdDto),
  pageController.getPageById
);

router.put(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(UpdatePageDto),
  pageController.updatePage
);

router.delete(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(PageIdDto),
  pageController.deletePage
);

export default router;
