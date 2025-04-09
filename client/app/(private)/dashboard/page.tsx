"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import AreaChart from "@/app/components/charts/AreaChart";
import React from "react";
import { motion } from "framer-motion";
import {
  useGetStatsQuery,
  useGetYearRangeQuery,
} from "@/app/store/apis/DashboardApi";
import StatsCard from "@/app/components/organisms/StatsCard";
import {
  BarChart2,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import DonutChart from "@/app/components/charts/DonutChart";
import BarChart from "@/app/components/charts/BarChart";
import ListCard from "@/app/components/organisms/ListCard";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "@/app/components/molecules/Dropdown";
import DateRangePicker from "@/app/components/molecules/DateRangePicker";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";

const Dashboard = () => {
  const { control, watch } = useForm();
  const formatPrice = useFormatPrice();
  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const { timePeriod, year, startDate, endDate, useCustomRange } = watch();

  const { data: yearRangeData } = useGetYearRangeQuery({});
  const minYear = yearRangeData?.minYear || new Date().getFullYear();
  const maxYear = yearRangeData?.maxYear || new Date().getFullYear();
  const yearOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
    label: (minYear + i).toString(),
    value: (minYear + i).toString(),
  }));

  const { data, isLoading, error } = useGetStatsQuery({
    timePeriod: timePeriod || "allTime",
    year: useCustomRange ? undefined : year,
    startDate: useCustomRange ? startDate : undefined,
    endDate: useCustomRange ? endDate : undefined,
  });
  console.log("Stats => ", data);
  console.log("error : ", error);
  if (isLoading) return <div>Loading...</div>;

  return (
    <ProtectedRoute requiredRoles={["ADMIN", "SUPERADMIN"]}>
      <motion.div
        className="p-2 min-h-screen space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboad overview</h1>
          <div className="flex items-center justify-center gap-2">
            <Controller
              name="timePeriod"
              control={control}
              defaultValue={timePeriod}
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

            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <Dropdown
                  onChange={field.onChange}
                  options={yearOptions}
                  value={field.value}
                  label="Year"
                  className="min-w-[150px] w-full max-w-[200px]"
                  disabled={useCustomRange}
                />
              )}
            />

            <DateRangePicker
              label="Custom Date Range"
              control={control}
              startName="startDate"
              endName="endDate"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatPrice(data?.totalRevenue)}
            percentage={data?.changes?.revenue}
            caption="since last month"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value={data?.totalOrders}
            percentage={data?.changes?.orders}
            caption="since last month"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Sales"
            value={data?.totalSales}
            percentage={data?.changes?.sales}
            caption="since last month"
            icon={<BarChart2 className="w-5 h-5" />}
          />

          <StatsCard
            title="Average Order Value"
            value={formatPrice(data?.averageOrderValue)}
            percentage={data?.changes?.averageOrderValue}
            caption="since last month"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Users"
            value={data?.totalUsers}
            percentage={data?.changes?.users}
            caption="since last month"
            icon={<Users className="w-5 h-5" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AreaChart
            title="Order Analytics"
            data={data?.monthly?.orders || []}
            categories={data?.monthly?.labels || []}
            color="#ec4899"
            percentageChange={data?.changes?.orders}
          />
          <AreaChart
            title="Revenue Analytics"
            data={data?.monthly?.revenue || []}
            categories={data?.monthly?.labels || []}
            color="#22c55e"
            percentageChange={data?.changes?.revenue}
          />
          <AreaChart
            title="Sales Analytics"
            data={data?.monthly?.sales || []}
            categories={data?.monthly?.labels || []}
            color="#3b82f6"
            percentageChange={data?.changes?.sales}
          />
          <AreaChart
            title="User Analytics"
            data={data?.monthly?.users || []}
            categories={data?.monthly?.labels || []}
            color="#f59e0b"
            percentageChange={data?.changes?.users}
          />
          <DonutChart
            title="Most Sold Products"
            data={data?.mostSoldProducts?.data || []}
            labels={data?.mostSoldProducts?.labels || []}
          />
          <ListCard
            title="Top Customers"
            viewAllLink="/dashboard/users"
            items={data?.topUsers || []}
            itemType="user"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarChart
            title="Sales by Product"
            data={data?.salesByProduct?.data || []}
            categories={data?.salesByProduct?.categories || []}
            color="#4CAF50"
          />
          <ListCard
            title="Top Items"
            viewAllLink={`/shop`}
            items={data?.topItems || []}
            itemType="product"
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default Dashboard;
