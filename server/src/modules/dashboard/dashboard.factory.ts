import { DashboardRepository } from "./dashboard.repository";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import ProductRepository from "../product/product.repository";

export const makeDashboardController = () => {
  const dashboardRepo = new DashboardRepository();
  const productRepo = new ProductRepository();
  const service = new DashboardService(dashboardRepo, productRepo);
  return new DashboardController(service);
};
