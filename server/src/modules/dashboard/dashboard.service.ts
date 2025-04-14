import { DashboardRepository } from "./dashboard.repository";
import { subDays, subMonths, subYears, startOfYear, endOfYear } from "date-fns";
import calculatePercentageChange from "@/shared/utils/calculatePercentChange";
import redisClient from "@/infra/cache/redis";
import { ProductRepository } from "../product/product.repository";

export class DashboardService {
  constructor(
    private dashboardRepository: DashboardRepository,
    private productRepository: ProductRepository
  ) {}

  async getOrderYearRange() {
    const cacheKey = "dashboard:year-range";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const yearRange = await this.dashboardRepository.getOrderYearRange();
    await redisClient.setex(cacheKey, 3600, JSON.stringify(yearRange));
    return yearRange;
  }

  async getDashboardStats(
    timePeriod: string,
    year?: number,
    startDate?: Date,
    endDate?: Date
  ) {
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

    // Fetch user data
    const currentUsers = await this.dashboardRepository.getUsersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );
    const previousUsers =
      timePeriod !== "allTime" && timePeriod !== "custom"
        ? await this.dashboardRepository.getUsersByTimePeriod(
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];
    const allUsers = await this.dashboardRepository.getUsersByTimePeriod(
      undefined,
      undefined,
      yearStart,
      yearEnd
    );

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

    allOrders.forEach((order) => {
      const month = order.orderDate.getMonth() + 1;
      monthlyData[month].revenue += order.amount;
      monthlyData[month].orders += 1;
    });

    allOrderItems.forEach((item) => {
      const month = item.createdAt.getMonth() + 1;
      monthlyData[month].sales += item.quantity;
    });

    allUsers.forEach((user) => {
      const month = user.createdAt.getMonth() + 1;
      monthlyData[month].users += 1;
    });

    const monthlyRevenue = months.map((_, index) =>
      Number(monthlyData[index + 1].revenue.toFixed(2))
    );
    const monthlyOrders = months.map(
      (_, index) => monthlyData[index + 1].orders
    );
    const monthlySales = months.map((_, index) => monthlyData[index + 1].sales);
    const monthlyUsers = months.map((_, index) => monthlyData[index + 1].users);

    // Calculate most sold products for DonutChart, BarChart, and ListCard
    const productSales: { [key: string]: { name: string; quantity: number } } =
      {};
    for (const item of currentOrderItems) {
      const productId = item.productId;
      const productName =
        (await this.productRepository.findProductNameById(productId)) ??
        "Unknown Product";
      console.log("returned productName => ", productName);

      if (!productSales[productId]) {
        productSales[productId] = { name: productName, quantity: 0 };
      }
      productSales[productId].quantity += item.quantity;
    }

    console.log("Product sales => ", productSales);

    // Convert to array and sort by quantity
    const sortedProductSales = Object.entries(productSales)
      .map(([_, value]) => value)
      .sort((a, b) => b.quantity - a.quantity); // Descending

    console.log("Sorted Product Sales => ", sortedProductSales);

    // DonutChart: Top 4 products
    const mostSoldProducts = sortedProductSales.slice(0, 4);
    console.log("Most Sold Products => ", mostSoldProducts);
    const donutChartData = mostSoldProducts.map((product) => product.quantity);
    const donutChartLabels = mostSoldProducts.map((product) => product.name);

    // BarChart: Top 5 products
    const topProductsForBarChart = sortedProductSales.slice(0, 5);
    const barChartData = topProductsForBarChart.map(
      (product) => product.quantity
    );
    const barChartCategories = topProductsForBarChart.map(
      (product) => product.name
    );

    // ListCard: Top 4 products with additional details
    const topItems = await Promise.all(
      sortedProductSales.slice(0, 4).map(async (product, index) => {
        const productDetails = await this.productRepository.findProductByName(
          product.name
        );
        return {
          id: index + 1,
          name: product.name,
          slug: productDetails?.slug ?? "",
          subtitle: productDetails?.sku
            ? `SKU: ${productDetails.sku}`
            : "SKU: N/A",
          primaryInfo: productDetails?.price
            ? `$${productDetails.price}/item`
            : "$0/item",
          secondaryInfo: `${product.quantity} sold`,
          image: productDetails?.images?.[0] ?? "",
        };
      })
    );

    // ListCard: Top 4 users with the most orders
    const userOrderCounts: {
      [key: string]: {
        name: string;
        email: string;
        orderCount: number;
        avatar: string | null;
      };
    } = {};
    currentUsers.forEach((user) => {
      const orderCount = user.orders.length;
      const name = user.name || "Unknown User";
      userOrderCounts[user.id] = {
        name,
        email: user.email,
        orderCount,
        avatar: user.avatar,
      };
    });

    const sortedUserOrders = Object.entries(userOrderCounts)
      .map(([_, value]) => value)
      .sort((a, b) => b.orderCount - a.orderCount); // Sort by order count, descending

    const topUsers = sortedUserOrders.slice(0, 4).map((user, index) => ({
      id: index + 1,
      name: user.name,
      subtitle: user.email,
      primaryInfo: `${user.orderCount} orders`,
      secondaryInfo: user.orderCount > 0 ? "Active" : "Inactive",
      image: user.avatar,
    }));

    const result = {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalSales,
      totalUsers, // Add total users
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      timePeriod,
      changes: {
        revenue: revenueChange,
        orders: ordersChange,
        sales: salesChange,
        users: usersChange, // Add user growth percentage
        averageOrderValue: aovChange,
      },
      monthly: {
        labels: months,
        revenue: monthlyRevenue,
        orders: monthlyOrders,
        sales: monthlySales,
        users: monthlyUsers, // Add monthly user registrations
      },
      mostSoldProducts: {
        data: donutChartData,
        labels: donutChartLabels,
      },
      salesByProduct: {
        data: barChartData,
        categories: barChartCategories,
      },
      topItems,
      topUsers, // Add top users for ListCard
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }
  // async getAnalyticsData(
  //   startDate: Date,
  //   endDate: Date,
  //   category?: string,
  //   region?: string
  // ) {
  //   const cacheKey = `analytics:${startDate.toISOString()}:${endDate.toISOString()}:${
  //     category || "all"
  //   }:${region || "all"}`;
  //   const cachedData = await redisClient.get(cacheKey);

  //   if (cachedData) {
  //     return JSON.parse(cachedData);
  //   }

  //   // Fetch orders, order items, and users with filters
  //   const orders = await this.dashboardRepository.getOrdersByTimePeriod(
  //     startDate,
  //     endDate,
  //     undefined,
  //     undefined,
  //     category,
  //     region
  //   );
  //   const orderItems = await this.dashboardRepository.getOrderItemsByTimePeriod(
  //     startDate,
  //     endDate,
  //     undefined,
  //     undefined,
  //     category,
  //     region
  //   );
  //   const users = await this.dashboardRepository.getUsersByTimePeriod(
  //     startDate,
  //     endDate,
  //     undefined,
  //     undefined,
  //     region
  //   );

  //   // Sales by Category
  //   const salesByCategory: {
  //     [key: string]: { name: string; revenue: number; quantity: number };
  //   } = {};
  //   for (const item of orderItems) {
  //     const product = await this.productRepository.findProductById(
  //       item.productId
  //     );
  //     const categoryName = product?.category || "Uncategorized";
  //     if (!salesByCategory[categoryName]) {
  //       salesByCategory[categoryName] = {
  //         name: categoryName,
  //         revenue: 0,
  //         quantity: 0,
  //       };
  //     }
  //     salesByCategory[categoryName].revenue +=
  //       item.quantity * (product?.price || 0);
  //     salesByCategory[categoryName].quantity += item.quantity;
  //   }

  //   const sortedSalesByCategory = Object.values(salesByCategory).sort(
  //     (a, b) => b.revenue - a.revenue
  //   );

  //   // Customer Retention (simplified: % of users who placed multiple orders)
  //   const userOrderCounts: { [key: string]: number } = {};
  //   orders.forEach((order) => {
  //     const userId = order.userId;
  //     userOrderCounts[userId] = (userOrderCounts[userId] || 0) + 1;
  //   });
  //   const repeatCustomers = Object.values(userOrderCounts).filter(
  //     (count) => count > 1
  //   ).length;
  //   const retentionRate =
  //     users.length > 0 ? (repeatCustomers / users.length) * 100 : 0;

  //   // Order Details (for table)
  //   const orderDetails = orders.map((order) => ({
  //     id: order.id,
  //     user: order.user?.email || "Unknown",
  //     amount: order.amount,
  //     items: order.items.length,
  //     date: order.orderDate,
  //     status: order.status,
  //   }));

  //   const result = {
  //     salesByCategory: {
  //       labels: sortedSalesByCategory.map((cat) => cat.name),
  //       revenue: sortedSalesByCategory.map((cat) => cat.revenue),
  //       quantity: sortedSalesByCategory.map((cat) => cat.quantity),
  //     },
  //     retentionRate: Number(retentionRate.toFixed(2)),
  //     orderDetails,
  //   };

  //   await redisClient.setex(cacheKey, 300, JSON.stringify(result));
  //   return result;
  // }
}
