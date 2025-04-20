import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { analyticsResolvers } from "./resolver";

const typeDefs = gql`
  type YearRange {
    minYear: Int!
    maxYear: Int!
  }

  type Changes {
    revenue: Float
    orders: Float
    sales: Float
    users: Float
    averageOrderValue: Float
  }

  type MonthlyTrend {
    labels: [String!]!
    revenue: [Float!]!
    orders: [Int!]!
    sales: [Int!]!
    users: [Int!]!
  }

  type AnalyticsOverview {
    totalRevenue: Float!
    totalOrders: Int!
    totalSales: Int!
    totalUsers: Int!
    averageOrderValue: Float!
    changes: Changes!
    monthlyTrends: MonthlyTrend!
  }

  type ProductPerformance {
    id: ID!
    name: String!
    quantity: Int!
    revenue: Float!
  }

  type TopCustomer {
    id: ID!
    name: String!
    email: String!
    orderCount: Int!
    totalSpent: Float!
    engagementScore: Float!
  }

  type InteractionTrend {
    labels: [String!]!
    views: [Int!]!
    clicks: [Int!]!
    others: [Int!]!
  }

  type CustomerAnalytics {
    totalCustomers: Int!
    retentionRate: Float!
    lifetimeValue: Float!
    repeatPurchaseRate: Float!
    engagementScore: Float!
    topCustomers: [TopCustomer!]!
    interactionTrends: InteractionTrend!
  }

  type InteractionByType {
    views: Int!
    clicks: Int!
    others: Int!
  }

  type MostViewedProduct {
    productId: ID!
    productName: String!
    viewCount: Int!
  }

  type InteractionAnalytics {
    totalInteractions: Int!
    byType: InteractionByType!
    mostViewedProducts: [MostViewedProduct!]!
  }

  input DateRangeQueryInput {
    timePeriod: String
    year: Int
    startDate: String
    endDate: String
    category: String
  }

  type SearchResult {
    type: String!
    id: String!
    title: String!
    description: String
  }

  input SearchInput {
    searchQuery: String!
  }

  type Query {
    yearRange: YearRange!
    analyticsOverview(params: DateRangeQueryInput!): AnalyticsOverview!
    productPerformance(params: DateRangeQueryInput!): [ProductPerformance!]!
    customerAnalytics(params: DateRangeQueryInput!): CustomerAnalytics!
    interactionAnalytics(params: DateRangeQueryInput!): InteractionAnalytics!
    searchDashboard(params: SearchInput!): [SearchResult!]!
  }
`;

export const analyticsSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: analyticsResolvers,
});
