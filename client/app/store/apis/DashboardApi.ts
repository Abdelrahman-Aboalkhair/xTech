import { apiSlice } from "../slices/ApiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: ({ timePeriod, year, startDate, endDate }) => ({
        url: "/dashboard/stats",
        method: "GET",
        credentials: "include",
        params: {
          timePeriod,
          ...(year && { year }),
          ...(startDate && endDate && { startDate, endDate }),
        },
      }),
    }),
    getYearRange: builder.query({
      query: () => ({
        url: `/dashboard/year-range`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetStatsQuery, useGetYearRangeQuery } = dashboardApi;
