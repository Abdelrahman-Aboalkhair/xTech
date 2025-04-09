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
import { Package, ShoppingCart } from "lucide-react";
import DonutChart from "@/app/components/charts/DonutChart";
import BarChart from "@/app/components/charts/BarChart";
import ListCard from "@/app/components/organisms/ListCard";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "@/app/components/molecules/Dropdown";

const Dashboard = () => {
  const { control, watch } = useForm();
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

          <Controller
            name="useCustomRange"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                Use Custom Date Range
              </label>
            )}
          />

          {useCustomRange && (
            <>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                    className="border rounded px-2 py-1"
                    placeholder="Start Date (YYYY-MM-DD)"
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                    className="border rounded px-2 py-1"
                    placeholder="End Date (YYYY-MM-DD)"
                  />
                )}
              />
            </>
          )}
        </div>
        <div className="flex gap-4">
          <StatsCard
            title="Total Revenue"
            value={data?.totalRevenue}
            percentage={data?.changes?.revenue}
            caption="since last month"
            icon={<ShoppingCart className="w-5 h-5" />}
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
            icon={<Package className="w-5 h-5" />}
          />

          <StatsCard
            title="Average Order Value"
            value={data?.averageOrderValue}
            percentage={data?.changes?.averageOrderValue}
            caption="since last month"
            icon={<Package className="w-5 h-5" />}
          />
          {/* NOT YET SUPPORTED BY API */}
          <StatsCard
            title="Total Users"
            value={data?.totalSales}
            percentage={data?.changes?.sales}
            caption="since last month"
            icon={<Package className="w-5 h-5" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AreaChart
            title="Total Sales"
            data={data?.monthly?.sales || []}
            categories={data?.monthly?.labels || []}
            color="#3b82f6"
            percentageChange={data?.changes?.sales}
          />
          <AreaChart
            title="Total Orders"
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DonutChart
            title="Most Sold Products"
            data={data?.mostSoldProducts?.data || []}
            labels={data?.mostSoldProducts?.labels || []}
          />

          <BarChart
            title="Sales by Product"
            data={data?.salesByProduct?.data || []}
            categories={data?.salesByProduct?.categories || []}
            color="#4CAF50"
          />
          <ListCard
            title="Top Items"
            viewAllLink={`/products?timePeriod=${timePeriod}${
              year ? `&year=${year}` : ""
            }`}
            items={data?.topItems || []}
            itemType="product"
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default Dashboard;
