import express from "express";
import DashboardController from "../controllers/dashboardController";
import DashboardService from "../services/dashboardService";
import DashboardRepository from "../repositories/dashboardRepository";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
import ProductRepository from "../repositories/productRepository";

const router = express.Router();
const dashboardRepository = new DashboardRepository();
const productRepository = new ProductRepository();
const dashboardService = new DashboardService(
  dashboardRepository,
  productRepository
);
const dashboardController = new DashboardController(dashboardService);

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
