"use client";
import DonutChart from "@/app/components/charts/DonutChart";
import RevenueOverTimeChart from "@/app/components/charts/RevenueOverTimeChart";
import { AreaChart } from "lucide-react";
import React from "react";

const Charts = ({ data, mostSoldProducts, interactionByType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
      <AreaChart
        title="Order Trends"
        data={data?.revenueAnalytics?.monthlyTrends?.orders || []}
        categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
        color="#ec4899"
        percentageChange={data?.orderAnalytics?.changes?.orders}
      />
      <AreaChart
        title="Revenue Trends"
        data={data?.revenueAnalytics?.monthlyTrends?.revenue || []}
        categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
        color="#22c55e"
        percentageChange={data?.revenueAnalytics?.changes?.revenue}
      />
      <AreaChart
        title="Sales Trends"
        data={data?.revenueAnalytics?.monthlyTrends?.sales || []}
        categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
        color="#3b82f6"
        percentageChange={data?.orderAnalytics?.changes?.sales}
      />
      <AreaChart
        title="User Trends"
        data={data?.revenueAnalytics?.monthlyTrends?.users || []}
        categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
        color="#f59e0b"
        percentageChange={data?.userAnalytics?.changes?.users}
      />
      <AreaChart
        title="Interaction Trends (Views)"
        data={data?.userAnalytics?.interactionTrends?.views || []}
        categories={data?.userAnalytics?.interactionTrends?.labels || []}
        color="#8b5cf6"
        percentageChange={data?.interactionAnalytics?.changes?.views}
      />
      <DonutChart
        title="Top 10 Products by Quantity"
        data={mostSoldProducts.data}
        labels={mostSoldProducts.labels}
      />
      <DonutChart
        title="Interactions by Type"
        data={interactionByType.data}
        labels={interactionByType.labels}
      />
      <RevenueOverTimeChart startDate="2023-01-01" endDate="2023-12-31" />
    </div>
  );
};

export default Charts;
