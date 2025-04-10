import { Router } from "express";
import widgetController from "../controllers/widgetController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
// import { validateDto } from "../middlewares/validateDto";
// import { CreateWidgetDto, UpdateWidgetDto, WidgetIdDto } from "../dtos/widgetDto";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(CreateWidgetDto),
  widgetController.createWidget
);

router.get(
  "/",
  protect,
  authorizeRole("SUPERADMIN"),
  widgetController.getAllWidgets
);

router.get(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(WidgetIdDto),
  widgetController.getWidgetById
);

router.put(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(UpdateWidgetDto),
  widgetController.updateWidget
);

router.delete(
  "/:id",
  protect,
  authorizeRole("SUPERADMIN"),
  //   validateDto(WidgetIdDto),
  widgetController.deleteWidget
);

export default router;
