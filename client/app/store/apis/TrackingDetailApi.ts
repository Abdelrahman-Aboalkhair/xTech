// store/apis/TrackingApi.ts
import { apiSlice } from "../slices/ApiSlice";

export const trackingDetailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tracking details for a specific user
    getUserTracking: builder.query({
      query: () => ({
        url: "/tracking", // Replace with the actual endpoint for user-specific tracking details
        method: "GET",
      }),
      transformResponse: (response: any) => response.tracking,
    }),

    // Get all tracking details (admin only)
    getAllTracking: builder.query({
      query: () => ({
        url: "/tracking/all", // Replace with the actual endpoint for all tracking records
        method: "GET",
      }),
      transformResponse: (response: any) => response.tracking,
    }),

    // Delete a tracking record (admin only)
    deleteTracking: builder.mutation({
      query: (trackingId: string) => ({
        url: `/tracking/${trackingId}`, // Replace with the actual delete endpoint
        method: "DELETE",
      }),
    }),
  }),

  // Automatically provides hooks for the defined endpoints
  overrideExisting: false,
});

export const {
  useGetUserTrackingQuery,
  useGetAllTrackingQuery,
  useDeleteTrackingMutation,
} = trackingDetailApi;
