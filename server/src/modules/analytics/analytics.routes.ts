import { Router } from "express";
import { makeAnalyticsController } from "./analytics.factory";

const router = Router();
const controller = makeAnalyticsController();

router.get("/overview", controller.getAnalyticsOverview);
router.get("/products", controller.getProductPerformance);
router.get("/customers", controller.getCustomerAnalytics);
router.get("/export", controller.exportAnalytics);

export default router;
