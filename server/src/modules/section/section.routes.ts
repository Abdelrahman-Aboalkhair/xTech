import { Router } from "express";
import { makeSectionController } from "./section.factory";
import upload from "@/shared/middlewares/upload";

const router = Router();
const sectionController = makeSectionController();

router.get("/", sectionController.getAllSections);
router.get("/hero", sectionController.findHero);
router.get("/promo", sectionController.findPromo);
router.get("/benefits", sectionController.findBenefits);
router.get("/arrivals", sectionController.findArrivals);

router.post("/", upload.array("images", 5), sectionController.createSection);

router.put("/:type", sectionController.updateSection);

router.delete("/:type", sectionController.deleteSection);

export default router;
