import { gql } from "@apollo/client";

export const OVERVIEW_QUERY = gql`
  query Dashboard($params: QueryParamsInput!) {
    yearRange {
      minYear
      maxYear
    }
  }
`;

// analyticsOverview(params: $params) {
//   totalSales
//   totalOrders
//   averageOrderValue
// }
// productPerformance(params: $params) {
//   productId
//   name
//   sales
//   unitsSold
// }
// customerAnalytics(params: $params) {
//   totalCustomers
//   newCustomers
//   repeatCustomers
// }
// interactionAnalytics(params: $params) {
//   totalInteractions
//   byType {
//     type
//     count
//   }
//   mostViewedProducts {
//     productId
//     name
//     views
//   }
