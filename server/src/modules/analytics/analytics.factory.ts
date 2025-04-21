import { AnalyticsController } from "./analytics.controller";
import { ExportUtils } from "@/shared/utils/exportUtils";
import { AnalyticsService } from "./analytics.service";

export const makeAnalyticsController = () => {
  const exportUtils = new ExportUtils();
  const service = new AnalyticsService();
  const controller = new AnalyticsController(exportUtils, service);
  return controller;
};
