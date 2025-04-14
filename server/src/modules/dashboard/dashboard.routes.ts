import express from "express";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import { makeDashboardController } from "./dashboard.factory";

const router = express.Router();
const dashboardController = makeDashboardController();

// router.get('/search', protect, authorizeRole("ADMIN", "SUPERADMIN"), dashboardController.search);
router.get(
  "/stats",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  dashboardController.getDashboardStats
);

router.get(
  "/year-range",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  dashboardController.getYearRange
);

export default router;
