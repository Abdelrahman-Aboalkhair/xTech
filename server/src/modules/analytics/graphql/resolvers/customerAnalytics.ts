import { getDateRange } from "@/shared/utils/getDateRange";
import { Context } from "../resolver";
import { ROLE } from "@prisma/client";

const customerAnalytics = {
  Query: {
    customerAnalytics: async (_: any, { params }: any, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      const {
        currentStartDate,
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd,
      } = getDateRange({ timePeriod, year, startDate, endDate });

      const users = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: currentStartDate,
            lte: endDate ? new Date(endDate) : undefined,
            gte: yearStart,
            lte: yearEnd,
          },
          role: ROLE.USER,
        },
        include: { orders: true },
      });
      const interactions = await prisma.interaction.findMany({
        where: {
          createdAt: {
            gte: currentStartDate,
            lte: endDate ? new Date(endDate) : undefined,
            gte: yearStart,
            lte: yearEnd,
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
              gte: previousStartDate,
              lte: previousEndDate,
              gte: yearStart,
              lte: yearEnd,
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
  },
};

export default customerAnalytics;
