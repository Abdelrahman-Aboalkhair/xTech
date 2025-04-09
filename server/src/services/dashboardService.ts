import DashboardRepository from "../repositories/dashboardRepository";
import { subDays, subMonths, subYears, startOfYear, endOfYear } from "date-fns";
import calculatePercentageChange from "../utils/calculatePercentChange";
import redisClient from "../config/redis";

class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async getOrderYearRange() {
    const cacheKey = "dashboard:year-range";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const yearRange = await this.dashboardRepository.getOrderYearRange();
    await redisClient.setex(cacheKey, 3600, JSON.stringify(yearRange)); // Cache for 1 hour
    return yearRange;
  }

  async getDashboardStats(
    timePeriod: string,
    year?: number,
    startDate?: Date,
    endDate?: Date
  ) {
    // Create a unique cache key based on query parameters
    const cacheKey = `dashboard:stats:${timePeriod}:${year || "all"}:${
      startDate ? startDate.toISOString() : "none"
    }:${endDate ? endDate.toISOString() : "none"}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const now = new Date();
    let currentStartDate: Date | undefined;
    let previousStartDate: Date | undefined;
    let previousEndDate: Date | undefined;

    // Apply year filter if provided
    let yearStart: Date | undefined;
    let yearEnd: Date | undefined;
    if (year) {
      yearStart = startOfYear(new Date(year, 0, 1));
      yearEnd = endOfYear(new Date(year, 0, 1));
    }

    // If custom startDate and endDate are provided, override timePeriod
    if (startDate && endDate) {
      currentStartDate = startDate;
      previousStartDate = undefined;
      previousEndDate = undefined;
      timePeriod = "custom";
    } else {
      switch (timePeriod) {
        case "last7days":
          currentStartDate = subDays(now, 7);
          previousStartDate = subDays(now, 14);
          previousEndDate = subDays(now, 7);
          break;
        case "lastMonth":
          currentStartDate = subMonths(now, 1);
          previousStartDate = subMonths(now, 2);
          previousEndDate = subMonths(now, 1);
          break;
        case "lastYear":
          currentStartDate = subYears(now, 1);
          previousStartDate = subYears(now, 2);
          previousEndDate = subYears(now, 1);
          break;
        case "allTime":
          currentStartDate = undefined;
          previousStartDate = undefined;
          previousEndDate = undefined;
          break;
      }
    }

    // Fetch current period data with year filter
    const currentOrders = await this.dashboardRepository.getOrdersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );
    const currentOrderItems =
      await this.dashboardRepository.getOrderItemsByTimePeriod(
        currentStartDate,
        endDate,
        yearStart,
        yearEnd
      );

    const previousOrders =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? await this.dashboardRepository.getOrdersByTimePeriod(
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];
    const previousOrderItems =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? await this.dashboardRepository.getOrderItemsByTimePeriod(
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];

    // Calculate aggregate stats for current period
    const totalRevenue = currentOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const totalOrders = currentOrders.length;
    const totalSales = currentOrderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const previousTotalRevenue = previousOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const previousTotalOrders = previousOrders.length;
    const previousTotalSales = previousOrderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const previousAverageOrderValue =
      previousTotalOrders > 0 ? previousTotalRevenue / previousTotalOrders : 0;

    const revenueChange =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? calculatePercentageChange(totalRevenue, previousTotalRevenue)
        : null;
    const ordersChange =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? calculatePercentageChange(totalOrders, previousTotalOrders)
        : null;
    const salesChange =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? calculatePercentageChange(totalSales, previousTotalSales)
        : null;
    const aovChange =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? calculatePercentageChange(
            averageOrderValue,
            previousAverageOrderValue
          )
        : null;

    // Fetch all orders and order items for monthly breakdown (with year filter)
    const allOrders = await this.dashboardRepository.getOrdersByTimePeriod(
      undefined,
      undefined,
      yearStart,
      yearEnd
    );
    const allOrderItems =
      await this.dashboardRepository.getOrderItemsByTimePeriod(
        undefined,
        undefined,
        yearStart,
        yearEnd
      );

    // Group by month for chart data
    const monthlyData: {
      [key: string]: { revenue: number; orders: number; sales: number };
    } = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    months.forEach((_, index) => {
      monthlyData[index + 1] = { revenue: 0, orders: 0, sales: 0 };
    });

    allOrders.forEach((order) => {
      const month = order.orderDate.getMonth() + 1;
      monthlyData[month].revenue += order.amount;
      monthlyData[month].orders += 1;
    });

    allOrderItems.forEach((item) => {
      // ! Be careful: I changed orderDate to createdAt
      const month = item.createdAt.getMonth() + 1;
      monthlyData[month].sales += item.quantity;
    });

    const monthlyRevenue = months.map((_, index) =>
      Number(monthlyData[index + 1].revenue.toFixed(2))
    );
    const monthlyOrders = months.map(
      (_, index) => monthlyData[index + 1].orders
    );
    const monthlySales = months.map((_, index) => monthlyData[index + 1].sales);

    const result = {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalSales,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      timePeriod,
      changes: {
        revenue: revenueChange,
        orders: ordersChange,
        sales: salesChange,
        averageOrderValue: aovChange,
      },
      monthly: {
        labels: months,
        revenue: monthlyRevenue,
        orders: monthlyOrders,
        sales: monthlySales,
      },
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(result)); // Cache for 5 minutes
    return result;
  }
}

export default DashboardService;
