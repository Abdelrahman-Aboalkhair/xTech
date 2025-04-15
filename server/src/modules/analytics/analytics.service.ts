import { subDays, subMonths, subYears, startOfYear, endOfYear } from "date-fns";
import redisClient from "@/infra/cache/redis";
import { AnalyticsRepository } from "./analytics.repository";
import { ProductRepository } from "../product/product.repository";
import calculatePercentageChange from "@/shared/utils/calculatePercentChange";
import {
  DateRangeQuery,
  AnalyticsOverview,
  ProductPerformance,
  CustomerAnalytics,
} from "./analytics.types";

export class AnalyticsService {
  constructor(
    private analyticsRepository: AnalyticsRepository,
    private productRepository: ProductRepository
  ) {}

  async getAnalyticsOverview(
    query: DateRangeQuery
  ): Promise<AnalyticsOverview> {
    const { timePeriod, year, startDate, endDate } = query;
    const cacheKey = `analytics:overview:${timePeriod}:${year || "all"}:${
      startDate?.toISOString() || "none"
    }:${endDate?.toISOString() || "none"}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const now = new Date();
    let currentStartDate: Date | undefined;
    let previousStartDate: Date | undefined;
    let previousEndDate: Date | undefined;
    let yearStart: Date | undefined;
    let yearEnd: Date | undefined;

    if (year) {
      yearStart = startOfYear(new Date(year, 0, 1));
      yearEnd = endOfYear(new Date(year, 0, 1));
    }

    if (startDate && endDate) {
      currentStartDate = startDate;
      previousStartDate = undefined; // No comparison for custom ranges
      previousEndDate = undefined;
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
        case "custom":
          throw new Error("Custom time period requires startDate and endDate");
      }
    }

    // Fetch data
    const currentOrders = await this.analyticsRepository.getOrdersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );
    const currentOrderItems =
      await this.analyticsRepository.getOrderItemsByTimePeriod(
        currentStartDate,
        endDate,
        yearStart,
        yearEnd
      );
    const currentUsers = await this.analyticsRepository.getUsersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );

    const previousOrders =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? await this.analyticsRepository.getOrdersByTimePeriod(
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];
    const previousOrderItems =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? await this.analyticsRepository.getOrderItemsByTimePeriod(
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];
    const previousUsers =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? await this.analyticsRepository.getUsersByTimePeriod(
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];

    // Calculate metrics
    const totalRevenue = currentOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const totalOrders = currentOrders.length;
    const totalSales = currentOrderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalUsers = currentUsers.length;
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
    const previousTotalUsers = previousUsers.length;
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
    const usersChange =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? calculatePercentageChange(totalUsers, previousTotalUsers)
        : null;
    const aovChange =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? calculatePercentageChange(
            averageOrderValue,
            previousAverageOrderValue
          )
        : null;

    // Monthly trends (similar to dashboard)
    const monthlyData = await this.calculateMonthlyTrends(
      yearStart,
      yearEnd,
      timePeriod
    );

    const result: AnalyticsOverview = {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalSales,
      totalUsers,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      changes: {
        revenue: revenueChange,
        orders: ordersChange,
        sales: salesChange,
        users: usersChange,
        averageOrderValue: aovChange,
      },
      monthlyTrends: monthlyData,
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getProductPerformance(query: {
    timePeriod: string;
    year?: number;
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }): Promise<ProductPerformance[]> {
    const { timePeriod, year, startDate, endDate, category } = query;
    const cacheKey = `analytics:product-performance:${timePeriod}:${
      year || "all"
    }:${startDate?.toISOString() || "none"}:${
      endDate?.toISOString() || "none"
    }:${category || "none"}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    let yearStart: Date | undefined;
    let yearEnd: Date | undefined;
    if (year) {
      yearStart = startOfYear(new Date(year, 0, 1));
      yearEnd = endOfYear(new Date(year, 0, 1));
    }

    const orderItems = await this.analyticsRepository.getOrderItemsByTimePeriod(
      startDate,
      endDate,
      yearStart,
      yearEnd,
      category
    );

    const productSales: {
      [key: string]: {
        id: string;
        name: string;
        quantity: number;
        revenue: number;
      };
    } = {};

    for (const item of orderItems) {
      const productId = item.productId;
      if (!productSales[productId]) {
        const product = await this.productRepository.findProductById(productId);
        productSales[productId] = {
          id: productId,
          name: product?.name || "Unknown",
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[productId].quantity += item.quantity;
      productSales[productId].revenue +=
        item.quantity * (item.product.price || 0);
    }

    const result = Object.values(productSales).sort(
      (a, b) => b.quantity - a.quantity
    );

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getCustomerAnalytics(
    query: DateRangeQuery
  ): Promise<CustomerAnalytics> {
    const { timePeriod, year, startDate, endDate } = query;
    const cacheKey = `analytics:customer:${timePeriod}:${year || "all"}:${
      startDate?.toISOString() || "none"
    }:${endDate?.toISOString() || "none"}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const now = new Date();
    let currentStartDate: Date | undefined;
    let previousStartDate: Date | undefined;
    let previousEndDate: Date | undefined;
    let yearStart: Date | undefined;
    let yearEnd: Date | undefined;

    if (year) {
      yearStart = startOfYear(new Date(year, 0, 1));
      yearEnd = endOfYear(new Date(year, 0, 1));
    }

    if (startDate && endDate) {
      currentStartDate = startDate;
      previousStartDate = undefined;
      previousEndDate = undefined;
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
        case "custom":
          throw new Error("Custom time period requires startDate and endDate");
      }
    }

    // Fetch users and their orders
    const users = await this.analyticsRepository.getUsersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );

    // Fetch interactions
    const interactions =
      await this.analyticsRepository.getInteractionsByTimePeriod(
        currentStartDate,
        endDate,
        yearStart,
        yearEnd
      );

    // Calculate metrics
    const totalCustomers = users.length;

    // Retention Rate: Customers with orders in both current and previous periods
    let retentionRate = 0;
    if (
      timePeriod !== "allTime" &&
      timePeriod !== "custom" &&
      previousStartDate &&
      previousEndDate
    ) {
      const previousUsers = await this.analyticsRepository.getUsersByTimePeriod(
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd
      );
      const previousUserIds = new Set(previousUsers.map((user) => user.id));
      const retainedCustomers = users.filter(
        (user) => previousUserIds.has(user.id) && user.orders.length > 0
      ).length;
      retentionRate =
        previousUsers.length > 0
          ? (retainedCustomers / previousUsers.length) * 100
          : 0;
    }

    // Lifetime Value: Average total revenue per customer
    const totalRevenue = users.reduce((sum, user) => {
      const userRevenue = user.orders.reduce(
        (orderSum, order) => orderSum + order.amount,
        0
      );
      return sum + userRevenue;
    }, 0);

    const lifetimeValue =
      totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Repeat Purchase Rate: Percentage of customers with more than one order
    const repeatCustomers = users.filter(
      (user) => user.orders.length > 1
    ).length;
    const repeatPurchaseRate =
      totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    // Engagement Score: Based on interactions (e.g., 1 point for view, 2 for click, 3 for other actions)
    const engagementScores: { [userId: string]: number } = {}; // { userId: score }
    interactions.forEach((interaction) => {
      const userId = interaction.userId;
      if (!engagementScores[userId]) {
        engagementScores[userId] = 0;
      }
      switch (interaction.type.toLowerCase()) {
        case "view":
          engagementScores[userId] += 1;
          break;
        case "click":
          engagementScores[userId] += 2;
          break;
        default:
          engagementScores[userId] += 3; // Other actions (e.g., wishlist, cart add)
      }
    });
    const totalEngagementScore = Object.values(engagementScores).reduce(
      (sum, score) => sum + score,
      0
    );
    const averageEngagementScore =
      totalCustomers > 0 ? totalEngagementScore / totalCustomers : 0;

    // Top Customers: Based on order count and total spent
    const topCustomers = users
      .map((user) => {
        const orderCount = user.orders.length;
        const totalSpent = user.orders.reduce(
          (sum, order) => sum + order.amount,
          0
        );
        return {
          id: user.id,
          name: user.name || "Unknown",
          email: user.email,
          orderCount,
          totalSpent,
          engagementScore: engagementScores[user.id] || 0,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent) // Sort by total spent
      .slice(0, 5); // Top 5 customers

    const result: CustomerAnalytics = {
      totalCustomers,
      retentionRate: Number(retentionRate.toFixed(2)),
      lifetimeValue: Number(lifetimeValue.toFixed(2)),
      repeatPurchaseRate: Number(repeatPurchaseRate.toFixed(2)),
      engagementScore: Number(averageEngagementScore.toFixed(2)),
      topCustomers,
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  private async calculateMonthlyTrends(
    yearStart?: Date,
    yearEnd?: Date,
    timePeriod?: string
  ) {
    const orders = await this.analyticsRepository.getOrdersByTimePeriod(
      undefined,
      undefined,
      yearStart,
      yearEnd
    );
    const orderItems = await this.analyticsRepository.getOrderItemsByTimePeriod(
      undefined,
      undefined,
      yearStart,
      yearEnd
    );
    const users = await this.analyticsRepository.getUsersByTimePeriod(
      undefined,
      undefined,
      yearStart,
      yearEnd
    );

    const monthlyData: {
      [key: string]: {
        revenue: number;
        orders: number;
        sales: number;
        users: number;
      };
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
      monthlyData[index + 1] = { revenue: 0, orders: 0, sales: 0, users: 0 };
    });

    orders.forEach((order) => {
      const month = order.orderDate.getMonth() + 1;
      monthlyData[month].revenue += order.amount;
      monthlyData[month].orders += 1;
    });
    orderItems.forEach((item) => {
      const month = item.createdAt.getMonth() + 1;
      monthlyData[month].sales += item.quantity;
    });
    users.forEach((user) => {
      const month = user.createdAt.getMonth() + 1;
      monthlyData[month].users += 1;
    });

    return {
      labels: months,
      revenue: months.map((_, index) =>
        Number(monthlyData[index + 1].revenue.toFixed(2))
      ),
      orders: months.map((_, index) => monthlyData[index + 1].orders),
      sales: months.map((_, index) => monthlyData[index + 1].sales),
      users: months.map((_, index) => monthlyData[index + 1].users),
    };
  }
}
