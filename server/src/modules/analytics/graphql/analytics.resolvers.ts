import { IResolvers } from "@graphql-tools/utils";
import { PrismaClient, ROLE } from "@prisma/client";
import { Request, Response } from "express";
import { subDays, subMonths, subYears, startOfYear, endOfYear } from "date-fns";
import calculatePercentageChange from "@/shared/utils/calculatePercentChange";

interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const resolvers: IResolvers = {
  Query: {
    // ** Get the avaliable years for analytics
    yearRange: async (_, __, { prisma }: Context) => {
      const orders = await prisma.order.aggregate({
        _min: { orderDate: true },
        _max: { orderDate: true },
      });
      const minYear =
        orders._min.orderDate?.getFullYear() || new Date().getFullYear();
      const maxYear =
        orders._max.orderDate?.getFullYear() || new Date().getFullYear();
      return { minYear, maxYear };
    },

    analyticsOverview: async (_, { params }, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      const now = new Date();
      let currentStartDate: any;
      let previousStartDate: any;
      let previousEndDate: any;
      let yearStart: any;
      let yearEnd: any;

      if (year) {
        yearStart = startOfYear(new Date(year, 0, 1));
        yearEnd = endOfYear(new Date(year, 0, 1));
      }

      if (startDate && endDate) {
        currentStartDate = new Date(startDate);
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
            throw new Error(
              "Custom time period requires startDate and endDate"
            );
        }
      }

      // Fetch current period data
      const currentOrders = await prisma.order.findMany({
        where: {
          orderDate: {
            gte: currentStartDate,
            lte: endDate ? new Date(endDate) : undefined,
          },
          createdAt: {
            gte: yearStart,
            lte: yearEnd,
          },
        },
      });
      const currentOrderItems = await prisma.orderItem.findMany({
        where: {
          createdAt: {
            gte:
              currentStartDate && yearStart
                ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                : currentStartDate || yearStart,
            lte: endDate ? new Date(endDate) : yearEnd,
          },
        },
        include: { product: true },
      });
      const currentUsers = await prisma.user.findMany({
        where: {
          createdAt: {
            gte:
              currentStartDate && yearStart
                ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                : currentStartDate || yearStart,
            lte: endDate ? new Date(endDate) : yearEnd,
          },
          role: ROLE.USER,
        },
      });

      // Fetch previous period data
      const previousOrders =
        timePeriod !== "allTime" && timePeriod !== "custom"
          ? await prisma.order.findMany({
              where: {
                orderDate: {
                  gte: previousStartDate,
                  lte: previousEndDate,
                },
                createdAt: {
                  gte: yearStart,
                  lte: yearEnd,
                },
              },
            })
          : [];
      const previousOrderItems =
        timePeriod !== "allTime" && timePeriod !== "custom"
          ? await prisma.orderItem.findMany({
              where: {
                createdAt: {
                  gte:
                    currentStartDate && yearStart
                      ? Math.max(
                          currentStartDate.getTime(),
                          yearStart.getTime()
                        )
                      : currentStartDate || yearStart,
                  lte: endDate ? new Date(endDate) : yearEnd,
                },
              },
              include: { product: true },
            })
          : [];
      const previousUsers =
        timePeriod !== "allTime" && timePeriod !== "custom"
          ? await prisma.user.findMany({
              where: {
                createdAt: {
                  gte:
                    currentStartDate && yearStart
                      ? Math.max(
                          currentStartDate.getTime(),
                          yearStart.getTime()
                        )
                      : currentStartDate || yearStart,
                  lte: endDate ? new Date(endDate) : yearEnd,
                },
                role: ROLE.USER,
              },
            })
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
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
        previousTotalOrders > 0
          ? previousTotalRevenue / previousTotalOrders
          : 0;

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

      // Monthly trends
      const ordersForTrends = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: yearStart,
            lte: yearEnd,
          },
        },
      });
      const orderItemsForTrends = await prisma.orderItem.findMany({
        where: {
          createdAt: {
            gte: yearStart,
            lte: yearEnd,
          },
        },
      });
      const usersForTrends = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: yearStart,
            lte: yearEnd,
          },
          role: ROLE.USER,
        },
      });

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

      ordersForTrends.forEach((order) => {
        const month = order.orderDate.getMonth() + 1;
        monthlyData[month].revenue += order.amount;
        monthlyData[month].orders += 1;
      });
      orderItemsForTrends.forEach((item) => {
        const month = item.createdAt.getMonth() + 1;
        monthlyData[month].sales += item.quantity;
      });
      usersForTrends.forEach((user) => {
        const month = user.createdAt.getMonth() + 1;
        monthlyData[month].users += 1;
      });

      return {
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
        monthlyTrends: {
          labels: months,
          revenue: months.map((_, index) =>
            Number(monthlyData[index + 1].revenue.toFixed(2))
          ),
          orders: months.map((_, index) => monthlyData[index + 1].orders),
          sales: months.map((_, index) => monthlyData[index + 1].sales),
          users: months.map((_, index) => monthlyData[index + 1].users),
        },
      };
    },

    productPerformance: async (_, { params }, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate, category } = params;
      let yearStart: any;
      let yearEnd: any;
      let currentStartDate: any;

      if (year) {
        yearStart = startOfYear(new Date(year, 0, 1));
        yearEnd = endOfYear(new Date(year, 0, 1));
      }

      if (startDate && endDate) {
        currentStartDate = new Date(startDate);
      } else {
        const now = new Date();
        switch (timePeriod) {
          case "last7days":
            currentStartDate = subDays(now, 7);
            break;
          case "lastMonth":
            currentStartDate = subMonths(now, 1);
            break;
          case "lastYear":
            currentStartDate = subYears(now, 1);
            break;
          case "allTime":
            currentStartDate = undefined;
            break;
          case "custom":
            throw new Error(
              "Custom time period requires startDate and endDate"
            );
        }
      }

      const orderItems = await prisma.orderItem.findMany({
        where: {
          createdAt: {
            gte:
              currentStartDate && yearStart
                ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                : currentStartDate || yearStart,
            lte: endDate ? new Date(endDate) : yearEnd,
          },
          product: category ? { categoryId: category } : undefined,
        },
        include: { product: true },
      });

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
          productSales[productId] = {
            id: productId,
            name: item.product.name || "Unknown",
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue +=
          item.quantity * (item.product.price || 0);
      }

      return Object.values(productSales).sort(
        (a, b) => b.quantity - a.quantity
      );
    },

    customerAnalytics: async (_, { params }, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      const now = new Date();
      let currentStartDate: any;
      let previousStartDate: any;
      let previousEndDate: any;
      let yearStart: any;
      let yearEnd: any;

      if (year) {
        yearStart = startOfYear(new Date(year, 0, 1));
        yearEnd = endOfYear(new Date(year, 0, 1));
      }

      if (startDate && endDate) {
        currentStartDate = new Date(startDate);
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
            throw new Error(
              "Custom time period requires startDate and endDate"
            );
        }
      }

      const users = await prisma.user.findMany({
        where: {
          createdAt: {
            gte:
              currentStartDate && yearStart
                ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                : currentStartDate || yearStart,
            lte: endDate ? new Date(endDate) : yearEnd,
          },
          role: ROLE.USER,
        },
        include: { orders: true },
      });
      const interactions = await prisma.interaction.findMany({
        where: {
          createdAt: {
            gte:
              currentStartDate && yearStart
                ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                : currentStartDate || yearStart,
            lte: endDate ? new Date(endDate) : yearEnd,
          },
        },
      });

      const totalCustomers = users.length;

      let retentionRate = 0;
      if (
        timePeriod !== "allTime" &&
        timePeriod !== "custom" &&
        previousStartDate &&
        previousEndDate
      ) {
        const previousUsers = await prisma.user.findMany({
          where: {
            createdAt: {
              gte:
                currentStartDate && yearStart
                  ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                  : currentStartDate || yearStart,
              lte: endDate ? new Date(endDate) : yearEnd,
            },
            role: ROLE.USER,
          },
          include: { orders: true },
        });
        const previousUserIds = new Set(previousUsers.map((user) => user.id));
        const retainedCustomers = users.filter(
          (user) => previousUserIds.has(user.id) && user.orders.length > 0
        ).length;
        retentionRate =
          previousUsers.length > 0
            ? (retainedCustomers / previousUsers.length) * 100
            : 0;
      }

      const totalRevenue = users.reduce((sum, user) => {
        const userRevenue = user.orders.reduce(
          (orderSum, order) => orderSum + order.amount,
          0
        );
        return sum + userRevenue;
      }, 0);
      const lifetimeValue =
        totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

      const repeatCustomers = users.filter(
        (user) => user.orders.length > 1
      ).length;
      const repeatPurchaseRate =
        totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

      const engagementScores: { [userId: string]: number } = {};
      interactions.forEach((interaction) => {
        const userId = interaction.userId;
        if (!engagementScores[userId]) engagementScores[userId] = 0;
        switch (interaction.type.toLowerCase()) {
          case "view":
            engagementScores[userId] += 1;
            break;
          case "click":
            engagementScores[userId] += 2;
            break;
          default:
            engagementScores[userId] += 3;
        }
      });
      const totalEngagementScore = Object.values(engagementScores).reduce(
        (sum, score) => sum + score,
        0
      );
      const averageEngagementScore =
        totalCustomers > 0 ? totalEngagementScore / totalCustomers : 0;

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
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

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
      const interactionTrends: {
        [month: string]: { views: number; clicks: number; others: number };
      } = {};
      months.forEach((_, index) => {
        interactionTrends[index + 1] = { views: 0, clicks: 0, others: 0 };
      });

      interactions.forEach((interaction) => {
        const month = interaction.createdAt.getMonth() + 1;
        switch (interaction.type.toLowerCase()) {
          case "view":
            interactionTrends[month].views += 1;
            break;
          case "click":
            interactionTrends[month].clicks += 1;
            break;
          default:
            interactionTrends[month].others += 1;
        }
      });

      return {
        totalCustomers,
        retentionRate: Number(retentionRate.toFixed(2)),
        lifetimeValue: Number(lifetimeValue.toFixed(2)),
        repeatPurchaseRate: Number(repeatPurchaseRate.toFixed(2)),
        engagementScore: Number(averageEngagementScore.toFixed(2)),
        topCustomers,
        interactionTrends: {
          labels: months,
          views: months.map((_, index) => interactionTrends[index + 1].views),
          clicks: months.map((_, index) => interactionTrends[index + 1].clicks),
          others: months.map((_, index) => interactionTrends[index + 1].others),
        },
      };
    },

    interactionAnalytics: async (_, { params }, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      const now = new Date();
      let currentStartDate: any;
      let yearStart: any;
      let yearEnd: any;

      if (year) {
        yearStart = startOfYear(new Date(year, 0, 1));
        yearEnd = endOfYear(new Date(year, 0, 1));
      }

      if (startDate && endDate) {
        currentStartDate = new Date(startDate);
      } else {
        switch (timePeriod) {
          case "last7days":
            currentStartDate = subDays(now, 7);
            break;
          case "lastMonth":
            currentStartDate = subMonths(now, 1);
            break;
          case "lastYear":
            currentStartDate = subYears(now, 1);
            break;
          case "allTime":
            currentStartDate = undefined;
            break;
          case "custom":
            throw new Error(
              "Custom time period requires startDate and endDate"
            );
        }
      }

      const interactions = await prisma.interaction.findMany({
        where: {
          createdAt: {
            gte:
              currentStartDate && yearStart
                ? Math.max(currentStartDate.getTime(), yearStart.getTime())
                : currentStartDate || yearStart,
            lte: endDate ? new Date(endDate) : yearEnd,
          },
        },
        include: { product: true },
      });

      const totalInteractions = interactions.length;
      const byType = {
        views: interactions.filter((i) => i.type.toLowerCase() === "view")
          .length,
        clicks: interactions.filter((i) => i.type.toLowerCase() === "click")
          .length,
        others: interactions.filter(
          (i) => !["view", "click"].includes(i.type.toLowerCase())
        ).length,
      };

      const productViews: {
        [productId: string]: { name: string; count: number };
      } = {};
      for (const interaction of interactions) {
        if (
          interaction.type.toLowerCase() === "view" &&
          interaction.productId
        ) {
          if (!productViews[interaction.productId]) {
            productViews[interaction.productId] = {
              name: interaction.product?.name || "Unknown",
              count: 0,
            };
          }
          productViews[interaction.productId].count += 1;
        }
      }

      const mostViewedProducts = Object.entries(productViews)
        .map(([productId, data]) => ({
          productId,
          productName: data.name,
          viewCount: data.count,
        }))
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);

      return {
        totalInteractions,
        byType,
        mostViewedProducts,
      };
    },
  },
};
