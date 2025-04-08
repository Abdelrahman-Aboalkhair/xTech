"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllTrackingQuery } from "@/app/store/apis/TrackingDetailApi";
import React from "react";

const TrackingDetail = () => {
  const { data, isLoading, error } = useGetAllTrackingQuery({});
  if (error) {
    console.log("Error fetching tracking details: ", error);
  }

  const trackingData = data || []; // Default to empty array if no data

  // Define the columns for the Table component
  const columns = [
    {
      key: "id",
      label: "Tracking ID",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <>
      <Table data={trackingData} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default TrackingDetail;
