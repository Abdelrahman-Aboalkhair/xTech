"use client";
import { useGetProfileQuery } from "@/app/store/apis/UserApi";
import { useParams } from "next/navigation";
import React from "react";
import { Circle } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

const Profile = () => {
  const { id } = useParams();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetProfileQuery(id);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (userError || !userData?.user) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error loading profile
      </div>
    );
  }

  const { name, email, phoneNumber, location } = userData.user;


  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <div className="flex items-center space-x-4">
          <Circle className="text-gray-600 text-5xl" />
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-gray-500">User</p> {/* Removed the driver role logic */}
          </div>
        </div>

        <div className="mt-5 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Contact Information
          </h3>
          <div className="mt-2 space-y-2">
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-blue-500" /> {phoneNumber}
            </p>
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-red-500" /> {email}
            </p>
            {location?.coordinates && (
              <p className="flex items-center text-gray-600">
                <Circle className="mr-2 text-green-500" /> Location:{" "}
                {location.coordinates.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Optionally render reviews or review submission form here */}
        {/* <ReviewForm onSubmit={handleSubmit(onSubmitReview)} /> */}
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
