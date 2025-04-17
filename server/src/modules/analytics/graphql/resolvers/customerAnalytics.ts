import { Context } from "../resolver";
import { ROLE } from "@prisma/client";
import {
  fetchData,
  shouldFetchPreviousPeriod,
  calculateEngagementScores,
  calculateRetentionRate,
  calculateCustomerMetrics,
  generateTopCustomers,
  aggregateInteractionTrends,
  getDateRange,
} from "@/shared/utils/analytics";

const customerAnalytics = {
  Query: {
    customerAnalytics: async (_: any, { params }: any, { prisma }: Context) => {
      const { timePeriod, year, startDate, endDate } = params;
      // Use getDateRange to compute date ranges, keeping date logic abstracted.
      const {
        currentStartDate,
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd,
      } = getDateRange({ timePeriod, year, startDate, endDate });

      // Fetch users and interactions for the current period
      const users = await fetchData(
        prisma,
        "user",
        "createdAt",
        currentStartDate,
        endDate,
        yearStart,
        yearEnd,
        ROLE.USER,
        { orders: true }
      );
      const interactions = await fetchData(
        prisma,
        "interaction",
        "createdAt",
        currentStartDate,
        endDate,
        yearStart,
        yearEnd
      );

      // Fetch previous period users only when needed, using shouldFetchPreviousPeriod to avoid redundant checks
      // ** Fetch previous is just a fancy way of getting users but like a week ago
      const fetchPrevious = shouldFetchPreviousPeriod(timePeriod);
      const previousUsers = fetchPrevious
        ? await fetchData(
            prisma,
            "user",
            "createdAt",
            previousStartDate,
            previousEndDate,
            yearStart,
            yearEnd,
            ROLE.USER,
            { orders: true }
          )
        : [];

      // Calculate customer metrics (total customers, revenue, LTV, repeat customers, rate) using a single utility.
      const {
        totalCustomers,
        totalRevenue,
        lifetimeValue,
        repeatPurchaseRate,
      } = calculateCustomerMetrics(users);

      // Calculate retention rate using a dedicated utility, encapsulating comparison logic.
      const retentionRate = fetchPrevious
        ? calculateRetentionRate(users, previousUsers)
        : 0;

      // Compute engagement scores and average using a utility, simplifying the switch-case logic.
      const { scores: engagementScores, averageScore: engagementScore } =
        calculateEngagementScores(interactions);

      // Generate top customers using a utility, isolating mapping and sorting logic.
      const topCustomers = generateTopCustomers(users, engagementScores);

      // Aggregate interaction trends (views, clicks, others) using a utility, reusing the monthly aggregation pattern.
      const interactionTrends = aggregateInteractionTrends(interactions);

      // Return the response with rounded numbers for clean presentation.
      return {
        totalCustomers,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        retentionRate: Number(retentionRate.toFixed(2)),
        lifetimeValue: Number(lifetimeValue.toFixed(2)),
        repeatPurchaseRate: Number(repeatPurchaseRate.toFixed(2)),
        engagementScore: Number(engagementScore.toFixed(2)),
        topCustomers,
        interactionTrends,
      };
    },
  },
};

export default customerAnalytics;
