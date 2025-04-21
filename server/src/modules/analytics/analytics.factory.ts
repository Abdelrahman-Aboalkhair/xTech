import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

export const makeAnalyticsController = () => {
  const service = new AnalyticsService();
  const controller = new AnalyticsController(service);
  return controller;
};
