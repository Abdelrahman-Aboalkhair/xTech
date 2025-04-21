import {
  calculateMetrics,
  fetchData,
  getDateRange,
  shouldFetchPreviousPeriod,
  calculateChanges,
  aggregateMonthlyTrends,
} from "@/shared/utils/analytics";
import { Context } from "../resolver";

const revenueAnalytics = {
  Query: {
    revenueAnalytics: async (_: any, { params }: any, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      const {
        currentStartDate,
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd,
      } = getDateRange({ timePeriod, year, startDate, endDate });

      // Fetch current period data
      const currentOrders = await fetchData(
        prisma,
        "order",
        "orderDate",
        currentStartDate,
        endDate,
        yearStart,
        yearEnd
      );
      const currentOrderItems = await fetchData(
        prisma,
        "orderItem",
        "createdAt",
        currentStartDate,
        endDate,
        yearStart,
        yearEnd,
        undefined,
        { product: true }
      );

      // Fetch previous period data if needed
      const fetchPrevious = shouldFetchPreviousPeriod(timePeriod);
      const previousOrders = fetchPrevious
        ? await fetchData(
            prisma,
            "order",
            "orderDate",
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd
          )
        : [];
      const previousOrderItems = fetchPrevious
        ? await fetchData(
            prisma,
            "orderItem",
            "createdAt",
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd,
            undefined,
            { product: true }
          )
        : [];

      // Calculate metrics for both periods
      const currentMetrics = calculateMetrics(
        currentOrders,
        currentOrderItems,
        []
      );
      const previousMetrics = calculateMetrics(
        previousOrders,
        previousOrderItems,
        []
      );

      // Compute changes
      const changes = calculateChanges(
        currentMetrics,
        previousMetrics,
        fetchPrevious
      );

      // Fetch data for monthly trends
      const ordersForTrends = await fetchData(
        prisma,
        "order",
        "createdAt",
        yearStart,
        yearEnd
      );
      const orderItemsForTrends = await fetchData(
        prisma,
        "orderItem",
        "createdAt",
        yearStart,
        yearEnd
      );
      const usersForTrends = await fetchData(
        prisma,
        "user",
        "createdAt",
        yearStart,
        yearEnd
      );

      // Aggregate monthly trends
      const monthlyTrends = aggregateMonthlyTrends(
        ordersForTrends,
        orderItemsForTrends,
        usersForTrends
      );

      return {
        totalRevenue: Number(currentMetrics.totalRevenue.toFixed(2)),
        changes: {
          revenue: changes.revenue,
        },
        monthlyTrends,
      };
    },
  },
};

export default revenueAnalytics;
