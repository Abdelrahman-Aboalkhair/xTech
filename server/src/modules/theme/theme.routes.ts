import { Router } from "express";
import themeController from "../controllers/themeController";

const router = Router();

router.post("/", themeController.createTheme);

router.get("/", themeController.getAllThemes);

router.get("/active", themeController.getActiveTheme);

router.put("/:id", themeController.updateTheme);

router.delete("/:id", themeController.deleteTheme);

export default router;
