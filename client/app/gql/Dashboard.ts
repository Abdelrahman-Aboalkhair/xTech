import { gql } from "@apollo/client";

export const GET_ANALYTICS_OVERVIEW = gql`
  query GetAnalyticsOverview($params: DateRangeQueryInput!) {
    revenueAnalytics(params: $params) {
      totalRevenue
      changes {
        revenue
      }
      monthlyTrends {
        labels
        revenue
      }
    }
    orderAnalytics(params: $params) {
      totalOrders
      changes {
        orders
      }
    }
    userAnalytics(params: $params) {
      totalUsers
      changes {
        users
      }
    }
    yearRange {
      minYear
      maxYear
    }
  }
`;

export const GET_ALL_ANALYTICS = gql`
  query GetAllAnalytics(
    $params: DateRangeQueryInput!
    $searchParams: SearchInput!
  ) {
    yearRange {
      minYear
      maxYear
    }
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
    userAnalytics(params: $params) {
      totalUsers
      totalRevenue
      retentionRate
      lifetimeValue
      repeatPurchaseRate
      engagementScore
      topUsers {
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
  }
`;

export const SEARCH_DASHBOARD = gql`
  query SearchDashboard($params: SearchInput!) {
    searchDashboard(params: $params) {
      type
      id
      title
      description
    }
  }
`;
