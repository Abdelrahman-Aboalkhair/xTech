import { Router } from "express";
import { makeSectionController } from "./section.factory";

const router = Router();
const sectionController = makeSectionController();

router.get("/", sectionController.getAllSections);

router.post("/", sectionController.createSection);

router.get("/:id", sectionController.getSectionById);

router.put("/:id", sectionController.updateSection);

router.delete("/:id", sectionController.deleteSection);

export default router;
