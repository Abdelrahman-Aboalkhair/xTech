import { Router } from "express";
import { makeAnalyticsController } from "./analytics.factory";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";

const router = Router();
const controller = makeAnalyticsController();

router.get("/overview", protect, controller.getAnalyticsOverview);
router.get("/products", protect, controller.getProductPerformance);
router.get("/customers", protect, controller.getCustomerAnalytics);
router.get("/interactions", protect, controller.getInteractionAnalytics);
router.post(
  "/interactions",
  authorizeRole("ADMIN", "SUPERADMIN"),
  controller.recordInteraction
);
router.get("/export", protect, controller.exportAnalytics);

export default router;
