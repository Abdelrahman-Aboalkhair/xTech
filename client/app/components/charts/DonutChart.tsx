"use client";
import React from "react";
import Chart from "react-apexcharts";

type Props = {
  title: string;
  data: number[];
  labels: string[];
  colorScheme?: string[];
};

const DonutChart: React.FC<Props> = ({
  title,
  data,
  labels,
  colorScheme = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"], // Default colors for sections
}) => {
  const options = {
    chart: {
      id: "donut-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: colorScheme,
    dataLabels: { enabled: true },
    stroke: {
      width: 0, // Remove the border between sections
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%", // Adjust the donut's size
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#9ca3af", // Set legend text color
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  const series = data;
  const labelsForChart = labels;

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-sm w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-black text-lg font-semibold">{title}</h2>
      </div>
      <Chart options={options} series={series} type="donut" height={250} />
    </div>
  );
};

export default DonutChart;
