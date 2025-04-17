import { gql } from "@apollo/client";

export const OVERVIEW_QUERY = gql`
  query Dashboard($params: QueryParamsInput!) {
    yearRange {
      minYear
      maxYear
    }
    dashboardOverview(params: $params) {
      totalSales
      totalOrders
      averageOrderValue
    }
    productPerformance(params: $params) {
      productId
      name
      sales
      unitsSold
    }
    customerAnalytics(params: $params) {
      totalCustomers
      newCustomers
      repeatCustomers
    }
  }
`;
