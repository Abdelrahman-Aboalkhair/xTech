export interface DateRangeQuery {
  timePeriod: string;
  year?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  totalSales: number;
  totalUsers: number;
  averageOrderValue: number;
  changes: {
    revenue: number | null;
    orders: number | null;
    sales: number | null;
    users: number | null;
    averageOrderValue: number | null;
  };
  monthlyTrends: {
    labels: string[];
    revenue: number[];
    orders: number[];
    sales: number[];
    users: number[];
  };
}

export interface ProductPerformance {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  retentionRate: number; // Percentage
  lifetimeValue: number; // Average LTV
  repeatPurchaseRate: number; // Percentage
  engagementScore: number; // Average score based on interactions
  topCustomers: {
    id: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
    engagementScore: number;
  }[];
}

export interface InteractionSummary {
  productId: string;
  productName: string;
  viewCount: number;
  clickCount: number;
  otherCount: number;
}

export type ExportableData =
  | AnalyticsOverview
  | ProductPerformance[]
  | CustomerAnalytics;
