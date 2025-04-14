import { Router } from "express";
import { makeThemeController } from "./theme.factory";

const router = Router();
const themeController = makeThemeController();

router.post("/", themeController.createTheme);

router.get("/", themeController.getAllThemes);

router.get("/active", themeController.getActiveTheme);

router.put("/:id", themeController.updateTheme);

router.delete("/:id", themeController.deleteTheme);

export default router;
