import { Router } from "express";
import sectionController from "../controllers/sectionController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
// import { validateDto } from "../middlewares/validateDto";
// import { CreateSectionDto, UpdateSectionDto, SectionIdDto } from "../dtos/sectionDto";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(CreateSectionDto),
  sectionController.createSection
);

router.get(
  "/page/:pageId",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(PageIdDto),
  sectionController.getSectionsByPageId
);

router.get(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(SectionIdDto),
  sectionController.getSectionById
);

router.put(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(UpdateSectionDto),
  sectionController.updateSection
);

router.delete(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(SectionIdDto),
  sectionController.deleteSection
);

export default router;
