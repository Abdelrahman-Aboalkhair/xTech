import DashboardRepository from "../repositories/dashboardRepository";
import { subDays, subMonths, subYears } from "date-fns";
import calculatePercentageChange from "../utils/calculatePercentChange";

class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async getDashboardStats(timePeriod: string) {
    const now = new Date();
    let currentStartDate: Date | undefined;
    let previousStartDate: Date | undefined;
    let previousEndDate: Date | undefined;

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

    const currentOrders = await this.dashboardRepository.getOrdersByTimePeriod(
      currentStartDate
    );
    const currentOrderItems =
      await this.dashboardRepository.getOrderItemsByTimePeriod(
        currentStartDate
      );

    const previousOrders =
      timePeriod !== "allTime"
        ? await this.dashboardRepository.getOrdersByTimePeriod(
            previousStartDate,
            previousEndDate
          )
        : [];
    const previousOrderItems =
      timePeriod !== "allTime"
        ? await this.dashboardRepository.getOrderItemsByTimePeriod(
            previousStartDate,
            previousEndDate
          )
        : [];

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
      timePeriod !== "allTime"
        ? calculatePercentageChange(totalRevenue, previousTotalRevenue)
        : null;
    const ordersChange =
      timePeriod !== "allTime"
        ? calculatePercentageChange(totalOrders, previousTotalOrders)
        : null;
    const salesChange =
      timePeriod !== "allTime"
        ? calculatePercentageChange(totalSales, previousTotalSales)
        : null;
    const aovChange =
      timePeriod !== "allTime"
        ? calculatePercentageChange(
            averageOrderValue,
            previousAverageOrderValue
          )
        : null;

    return {
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
    };
  }
}

export default DashboardService;
