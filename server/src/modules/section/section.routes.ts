import { Router } from "express";
import sectionController from "../controllers/sectionController";

const router = Router();

router.get("/", sectionController.getAllSections);

router.post("/", sectionController.createSection);

router.get("/page/:slug", sectionController.getSectionsByPageSlug);

router.get("/:id", sectionController.getSectionById);

router.put("/:id", sectionController.updateSection);

router.delete("/:id", sectionController.deleteSection);

export default router;
