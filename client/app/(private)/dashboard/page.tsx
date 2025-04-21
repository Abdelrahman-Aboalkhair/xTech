"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import AreaChart from "@/app/components/charts/AreaChart";
import StatsCard from "@/app/components/organisms/StatsCard";
import Dropdown from "@/app/components/molecules/Dropdown";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatPrice(data?.revenueAnalytics?.totalRevenue || 0)}
            percentage={data?.revenueAnalytics?.changes?.revenue}
            caption="since last period"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value={data?.orderAnalytics?.totalOrders || 0}
            percentage={data?.orderAnalytics?.changes?.orders}
            caption="since last period"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Users"
            value={data?.userAnalytics?.totalUsers || 0}
            percentage={data?.userAnalytics?.changes?.users}
            caption="since last period"
            icon={<Users className="w-5 h-5" />}
          />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <AreaChart
            title="Revenue Trends"
            data={data?.revenueAnalytics?.monthlyTrends?.revenue || []}
            categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
            color="#22c55e"
            percentageChange={data?.revenueAnalytics?.changes?.revenue}
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default Dashboard;
