"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import AreaChart from "@/app/components/charts/AreaChart";
import DonutChart from "@/app/components/charts/DonutChart";
import BarChart from "@/app/components/charts/BarChart";
import ListCard from "@/app/components/organisms/ListCard";
import StatsCard from "@/app/components/organisms/StatsCard";
import Dropdown from "@/app/components/molecules/Dropdown";
import {
  BarChart2,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { useQuery } from "@apollo/client";
import { GET_ANALYTICS_OVERVIEW } from "@/app/gql/Dashboard";
import CustomLoader from "@/app/components/feedback/CustomLoader";

interface FormData {
  timePeriod: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  useCustomRange?: boolean;
}

const Dashboard = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      timePeriod: "allTime",
      useCustomRange: false,
    },
  });
  const formatPrice = useFormatPrice();

  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const { timePeriod } = watch();

  const queryParams = {
    timePeriod: timePeriod || "allTime",
  };

  const { data, loading, error } = useQuery(GET_ANALYTICS_OVERVIEW, {
    variables: { params: queryParams },
  });

  console.log("Analytics Overview => ", data);

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    console.error("GraphQL Error:", error);
    return <div>Error loading dashboard data</div>;
  }

  const mostSoldProducts = {
    labels: data?.productPerformance?.slice(0, 5).map((p: any) => p.name) || [],
    data:
      data?.productPerformance?.slice(0, 5).map((p: any) => p.quantity) || [],
  };

  const salesByProduct = {
    categories: data?.productPerformance?.map((p: any) => p.name) || [],
    data: data?.productPerformance?.map((p: any) => p.revenue) || [],
  };

  const topItems =
    data?.productPerformance?.slice(0, 5).map((p: any) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      revenue: formatPrice(p.revenue),
    })) || [];

  const topCustomers =
    data?.customerAnalytics?.topCustomers?.slice(0, 5).map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      orderCount: c.orderCount,
      totalSpent: formatPrice(c.totalSpent),
      engagementScore: c.engagementScore,
    })) || [];

  const mostViewedProducts =
    data?.interactionAnalytics?.mostViewedProducts
      ?.slice(0, 5)
      .map((p: any) => ({
        id: p.productId,
        name: p.productName,
        viewCount: p.viewCount,
      })) || [];

  return (
    <ProtectedRoute requiredRoles={["ADMIN", "SUPERADMIN"]}>
      <motion.div
        className="p-2 min-h-screen space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          <div className="flex items-center justify-center gap-2">
            <Controller
              name="timePeriod"
              control={control}
              render={({ field }) => (
                <Dropdown
                  onChange={field.onChange}
                  options={timePeriodOptions}
                  value={field.value}
                  label="Time Period"
                  className="min-w-[150px] w-full max-w-[200px]"
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatPrice(data?.analyticsOverview?.totalRevenue || 0)}
            percentage={data?.analyticsOverview?.changes?.revenue}
            caption="since last period"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value={data?.analyticsOverview?.totalOrders || 0}
            percentage={data?.analyticsOverview?.changes?.orders}
            caption="since last period"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Sales"
            value={data?.analyticsOverview?.totalSales || 0}
            percentage={data?.analyticsOverview?.changes?.sales}
            caption="since last period"
            icon={<BarChart2 className="w-5 h-5" />}
          />
          <StatsCard
            title="Average Order Value"
            value={formatPrice(data?.analyticsOverview?.averageOrderValue || 0)}
            percentage={data?.analyticsOverview?.changes?.averageOrderValue}
            caption="since last period"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Users"
            value={data?.analyticsOverview?.totalUsers || 0}
            percentage={data?.analyticsOverview?.changes?.users}
            caption="since last period"
            icon={<Users className="w-5 h-5" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AreaChart
            title="Order Analytics"
            data={data?.analyticsOverview?.monthlyTrends?.orders || []}
            categories={data?.analyticsOverview?.monthlyTrends?.labels || []}
            color="#ec4899"
            percentageChange={data?.analyticsOverview?.changes?.orders}
          />
          <AreaChart
            title="Revenue Analytics"
            data={data?.analyticsOverview?.monthlyTrends?.revenue || []}
            categories={data?.analyticsOverview?.monthlyTrends?.labels || []}
            color="#22c55e"
            percentageChange={data?.analyticsOverview?.changes?.revenue}
          />
          <AreaChart
            title="Sales Analytics"
            data={data?.analyticsOverview?.monthlyTrends?.sales || []}
            categories={data?.analyticsOverview?.monthlyTrends?.labels || []}
            color="#3b82f6"
            percentageChange={data?.analyticsOverview?.changes?.sales}
          />
          <AreaChart
            title="User Analytics"
            data={data?.analyticsOverview?.monthlyTrends?.users || []}
            categories={data?.analyticsOverview?.monthlyTrends?.labels || []}
            color="#f59e0b"
            percentageChange={data?.analyticsOverview?.changes?.users}
          />

          <DonutChart
            title="Most Sold Products"
            data={mostSoldProducts.data}
            labels={mostSoldProducts.labels}
          />
          <ListCard
            title="Top Customers"
            viewAllLink="/dashboard/users"
            items={topCustomers}
            itemType="user"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarChart
            title="Sales by Product"
            data={salesByProduct.data}
            categories={salesByProduct.categories}
            color="#4CAF50"
          />
          <ListCard
            title="Top Items"
            viewAllLink="/shop"
            items={topItems}
            itemType="product"
          />
          <ListCard
            title="Most Viewed Products"
            viewAllLink="/shop"
            items={mostViewedProducts}
            itemType="product"
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default Dashboard;
