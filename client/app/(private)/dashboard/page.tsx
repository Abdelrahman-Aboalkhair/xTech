"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import AreaChart from "@/app/components/charts/AreaChart";
import React from "react";
import { motion } from "framer-motion";
import { useGetStatsQuery } from "@/app/store/apis/DashboardApi";
import StatsCard from "@/app/components/organisms/StatsCard";
import { Package, ShoppingCart } from "lucide-react";
import DonutChart from "@/app/components/charts/DonutChart";
import BarChart from "@/app/components/charts/BarChart";
import ListCard from "@/app/components/organisms/ListCard";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "@/app/components/molecules/Dropdown";

const Dashboard = () => {
  const { control, watch } = useForm({
    defaultValues: {
      timePeriod: "last7days",
    },
  });
  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const timePeriod = watch("timePeriod");
  const { data } = useGetStatsQuery(timePeriod);
  const chartCategories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return (
    <ProtectedRoute requiredRoles={["ADMIN", "SUPERADMIN"]}>
      <motion.div
        className="p-6 min-h-screen space-y-4"
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
            data={[10000, 12000, 15000, 18000, 20000, 25000]}
            categories={chartCategories}
            color="#3b82f6"
            percentageChange={data?.changes?.sales}
          />
          <AreaChart
            title="Total Orders"
            data={[400, 500, 600, 700, 800, 900]}
            categories={chartCategories}
            color="#ec4899"
            percentageChange={data?.changes?.orders}
          />
          <AreaChart
            title="Revenue Analytics"
            data={[100000, 120000, 140000, 160000, 180000, 200000]}
            categories={chartCategories}
            color="#22c55e"
            percentageChange={data?.changes?.revenue}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DonutChart
            title="Most Sold Products"
            data={[50, 30, 20, 10]}
            labels={["Product A", "Product B", "Product C", "Product D"]}
          />

          <BarChart
            title="Sales by Product"
            data={[10, 20, 30, 40, 50]}
            categories={[
              "Product A",
              "Product B",
              "Product C",
              "Product D",
              "Product E",
            ]}
            color="#4CAF50"
          />
          <ListCard />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default Dashboard;
