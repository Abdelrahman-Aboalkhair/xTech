import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import DashboardService from "../services/dashboardService";
import AppError from "../utils/AppError";

class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const { timePeriod } = req.query;
    const validPeriods = ["last7days", "lastMonth", "lastYear", "allTime"];

    if (!timePeriod || !validPeriods.includes(timePeriod as string)) {
      throw new AppError(
        400,
        "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, or allTime"
      );
    }

    const stats = await this.dashboardService.getDashboardStats(
      timePeriod as string
    );
    sendResponse(res, 200, stats, "Dashboard stats retrieved successfully");
  });
}

export default DashboardController;
