"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import AttributeForm from "./AttributeForm";
import AttributeAssignment from "./AttributeAssignment";
import AttributesList from "./AttributesList";
import DashboardHeader from "./DashboardHeader";
import { useGetAllAttributesQuery } from "@/app/store/apis/AttributeApi";

const AttributesDashboard: React.FC = () => {
  const { data, isLoading, error } = useGetAllAttributesQuery(undefined)
  console.log('attributes data => ', data)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg">
        Error loading attributes: {error.message ?? "Unknown error"}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Create Form */}
        <div className="lg:col-span-1">
          <AttributeForm />
        </div>

        {/* Right Column - Assignment & List */}
        <div className="lg:col-span-2 space-y-6">
          <AttributeAssignment
            attributes={data?.attributes || []}

          />
          <AttributesList
            attributes={data?.attributes || []}

          />
        </div>
      </div>
    </div>
  );
};

export default AttributesDashboard;
