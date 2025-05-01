"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_ATTRIBUTES } from "@/app/gql/Product";
import { Loader2 } from "lucide-react";

// Import components
import AttributeForm from "./AttributeForm";
import AttributeAssignment from "./AttributeAssignment";
import AttributesList from "./AttributesList";
import DashboardHeader from "./DashboardHeader";

const AttributesDashboard: React.FC = () => {
  const {
    data,
    loading: isLoading,
    error,
    refetch,
  } = useQuery(GET_ALL_ATTRIBUTES, {
    variables: { first: 100, skip: 0 },
  });

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
        Error loading attributes: {error.message}
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
          <AttributeForm refetchAttributes={refetch} />
        </div>

        {/* Right Column - Assignment & List */}
        <div className="lg:col-span-2 space-y-6">
          <AttributeAssignment
            attributes={data?.attributes || []}
            refetchAttributes={refetch}
          />
          <AttributesList
            attributes={data?.attributes || []}
            refetchAttributes={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default AttributesDashboard;
