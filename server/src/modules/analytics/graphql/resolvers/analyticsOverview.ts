import calculatePercentageChange from "@/shared/utils/calculatePercentChange";
import { Context } from "../resolver";
import { getDateRange } from "@/shared/utils/getDateRange";
import { ROLE } from "@prisma/client";

const analyticsOverview = {
  Query: {
    analyticsOverview: async (_: any, { params }: any, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      const {
        currentStartDate,
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd,
      } = getDateRange({ timePeriod, year, startDate, endDate });

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
            gte: currentStartDate,
            lte: endDate ? new Date(endDate) : undefined,
            gte: yearStart,
            lte: yearEnd,
          },
        },
        include: { product: true },
      });
      const currentUsers = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: currentStartDate,
            lte: endDate ? new Date(endDate) : undefined,
            gte: yearStart,
            lte: yearEnd,
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
                  gte: previousStartDate,
                  lte: previousEndDate,
                  gte: yearStart,
                  lte: yearEnd,
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
                  gte: previousStartDate,
                  lte: previousEndDate,
                  gte: yearStart,
                  lte: yearEnd,
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
  },
};

export default analyticsOverview;
