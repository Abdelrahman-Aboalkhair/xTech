import { Router } from "express";
import { makeSectionController } from "./section.factory";
import upload from "@/shared/middlewares/upload";

const router = Router();
const sectionController = makeSectionController();

router.get("/", sectionController.getAllSections);

router.post("/", upload.single("file"), sectionController.createSection);

router.get("/:id", sectionController.getSectionById);

router.put("/:id", sectionController.updateSection);

router.delete("/:id", sectionController.deleteSection);

export default router;
