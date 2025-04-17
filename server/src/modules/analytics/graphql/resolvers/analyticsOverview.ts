import {
  aggregateMonthlyTrends,
  calculateChanges,
  calculateMetrics,
  fetchData,
  getDateRange,
  shouldFetchPreviousPeriod,
} from "@/shared/utils/analytics";
import { Context } from "../resolver";
import { ROLE } from "@prisma/client";

const analyticsOverview = {
  Query: {
    analyticsOverview: async (_: any, { params }: any, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      // Use getDateRange to compute date ranges for current and previous periods, keeping date logic abstracted.
      const {
        currentStartDate,
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd,
      } = getDateRange({ timePeriod, year, startDate, endDate });

      // ? This fetchData utility consolidates the logic for fetching data for the current period.
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
      const currentUsers = await fetchData(
        prisma,
        "user",
        "createdAt",
        currentStartDate,
        endDate,
        yearStart,
        yearEnd,
        ROLE.USER
      );

      // Fetch previous period data only when needed, using the same fetchData utility.
      //* shouldFetchPreviousPeriod centralizes the logic for skipping 'allTime' and 'custom' periods.
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
      const previousUsers = fetchPrevious
        ? await fetchData(
            prisma,
            "user",
            "createdAt",
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd,
            ROLE.USER
          )
        : [];

      // Calculate metrics for both periods using a single utility, consolidating revenue, orders, sales, users, and AOV logic.
      const currentMetrics = calculateMetrics(
        currentOrders,
        currentOrderItems,
        currentUsers
      );
      const previousMetrics = calculateMetrics(
        previousOrders,
        previousOrderItems,
        previousUsers
      );

      // Compute percentage changes using a utility that handles all metrics and conditional logic for skipping changes.
      const changes = calculateChanges(
        currentMetrics,
        previousMetrics,
        fetchPrevious
      );

      // Fetch data for monthly trends, reusing fetchData for consistency.
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

      // Aggregate monthly trends using a utility that handles initialization and data mapping, keeping the resolver focused on orchestration.
      //* structure => { "Jan": { revenue: 0, orders: 0, sales: 0, users: 0 } }
      const monthlyTrends = aggregateMonthlyTrends(
        ordersForTrends,
        orderItemsForTrends,
        usersForTrends
      );

      // Return the response with rounded numbers, leveraging calculated metrics and trends.
      return {
        ...currentMetrics,
        totalRevenue: Number(currentMetrics.totalRevenue.toFixed(2)),
        averageOrderValue: Number(currentMetrics.averageOrderValue.toFixed(2)),
        changes,
        monthlyTrends,
      };
    },
  },
};

export default analyticsOverview;
