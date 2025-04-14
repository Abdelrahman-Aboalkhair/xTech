import { Router } from "express";
import { makeWidgetController } from "./widget.factory";

const router = Router();
const widgetController = makeWidgetController();

router.get("/hero-promo", widgetController.getHeroPromo);
router.get("/topbar", widgetController.getTopbar);

router.post("/", widgetController.createWidget);

router.get("/", widgetController.getAllWidgets);

router.get("/:id", widgetController.getWidgetById);

router.put("/:id", widgetController.updateWidget);

router.delete("/:id", widgetController.deleteWidget);

export default router;
