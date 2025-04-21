import { Router } from "express";
import { makeAnalyticsController } from "./analytics.factory";
import protect from "@/shared/middlewares/protect";

const router = Router();
const controller = makeAnalyticsController();

router.post("/interactions", protect, controller.createInteraction);
router.get("/year-range", protect, controller.getYearRange);
router.get("/export", protect, controller.exportAnalytics);

export default router;
