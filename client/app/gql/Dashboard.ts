import { gql } from "@apollo/client";

export const GET_ANALYTICS_OVERVIEW = gql`
  query GetAnalyticsOverview($params: DateRangeQueryInput!) {
    analyticsOverview(params: $params) {
      totalRevenue
      totalOrders
      totalSales
      totalUsers
      averageOrderValue
      changes {
        revenue
        orders
        sales
        users
        averageOrderValue
      }
      monthlyTrends {
        labels
        revenue
        orders
        sales
        users
      }
    }
    customerAnalytics(params: $params) {
      totalCustomers
      retentionRate
      lifetimeValue
      repeatPurchaseRate
      engagementScore
      topCustomers {
        id
        name
        email
        orderCount
        totalSpent
        engagementScore
      }
      interactionTrends {
        labels
        views
        clicks
        others
      }
    }
    productPerformance(params: $params) {
      id
      name
      quantity
      revenue
    }
    interactionAnalytics(params: $params) {
      totalInteractions
      byType {
        views
        clicks
        others
      }
      mostViewedProducts {
        productId
        productName
        viewCount
      }
    }
    yearRange {
      minYear
      maxYear
    }
  }
`;
