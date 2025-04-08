import { apiSlice } from "../slices/ApiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: (timePeriod) => ({
        url: `/dashboard/stats`,
        method: "GET",
        credentials: "include",
        params: { timePeriod },
      }),
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
