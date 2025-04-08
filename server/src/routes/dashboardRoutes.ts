import express from "express";
import DashboardController from "../controllers/dashboardController";
import DashboardService from "../services/dashboardService";
import DashboardRepository from "../repositories/dashboardRepository";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";

const router = express.Router();
const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);

router.get(
  "/stats",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  dashboardController.getDashboardStats
);

export default router;
