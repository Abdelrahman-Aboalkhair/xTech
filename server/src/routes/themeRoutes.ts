import { Router } from "express";
import themeController from "../controllers/themeController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
// import { validateDto } from "../middlewares/validateDto";
// import { CreateThemeDto, UpdateThemeDto, ThemeIdDto } from "../dtos/themeDto";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(CreateThemeDto),
  themeController.createTheme
);

router.get(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  themeController.getAllThemes
);

router.get(
  "/active",
  protect,
  authorizeRole("SUPERADMIN"),
  themeController.getActiveTheme
);

router.put(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(UpdateThemeDto),
  themeController.updateTheme
);

router.delete(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(ThemeIdDto),
  themeController.deleteTheme
);

export default router;
