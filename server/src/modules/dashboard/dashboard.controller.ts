// dashboardController.ts
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import DashboardService from "../services/dashboardService";
import AppError from "../utils/AppError";

class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const { timePeriod, year, startDate, endDate } = req.query;
    console.log("timePeriod: ", timePeriod);
    const validPeriods = [
      "last7days",
      "lastMonth",
      "lastYear",
      "allTime",
      "custom",
    ];

    // Validate timePeriod
    if (!timePeriod || !validPeriods.includes(timePeriod as string)) {
      throw new AppError(
        400,
        "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, or allTime"
      );
    }

    // Fetch dynamic year range
    const { minYear, maxYear } =
      await this.dashboardService.getOrderYearRange();

    // Validate year if provided
    let selectedYear: number | undefined;
    if (year) {
      selectedYear = parseInt(year as string, 10);
      if (
        isNaN(selectedYear) ||
        selectedYear < minYear ||
        selectedYear > maxYear
      ) {
        throw new AppError(
          400,
          `Invalid year. Must be a valid year between ${minYear} and ${maxYear}.`
        );
      }
    }

    // Validate and parse startDate and endDate if provided
    let customStartDate: Date | undefined;
    let customEndDate: Date | undefined;
    if (startDate && endDate) {
      customStartDate = new Date(startDate as string);
      customEndDate = new Date(endDate as string);

      if (isNaN(customStartDate.getTime()) || isNaN(customEndDate.getTime())) {
        throw new AppError(
          400,
          "Invalid startDate or endDate format. Use YYYY-MM-DD."
        );
      }

      if (customStartDate > customEndDate) {
        throw new AppError(400, "startDate must be before endDate.");
      }
    } else if (startDate || endDate) {
      throw new AppError(
        400,
        "Both startDate and endDate must be provided for a custom range."
      );
    }

    const stats = await this.dashboardService.getDashboardStats(
      timePeriod as string,
      selectedYear,
      customStartDate,
      customEndDate
    );
    sendResponse(res, 200, stats, "Dashboard stats retrieved successfully");
  });

  getYearRange = asyncHandler(async (req: Request, res: Response) => {
    const yearRange = await this.dashboardService.getOrderYearRange();
    sendResponse(res, 200, yearRange, "Year range retrieved successfully");
  });
}

export default DashboardController;
