import { apiSlice } from "../slices/ApiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<any, void>({
      query: () => ({
        url: "/analytics/overview",
        method: "GET",
      }),
    }),

    getYearRange: builder.query<any, void>({
      query: () => ({
        url: "/analytics/year-range",
        method: "GET",
      }),
    }),

    getProductPerformance: builder.query<any, void>({
      query: () => ({
        url: "/analytics/products",
        method: "GET",
      }),
    }),

    getCustomerAnalytics: builder.query<any, void>({
      query: () => ({
        url: "/analytics/customers",
        method: "GET",
      }),
    }),

    getInteractionAnalytics: builder.query<any, void>({
      query: () => ({
        url: "/analytics/interactions",
        method: "GET",
      }),
    }),

    recordInteraction: builder.mutation<any, Record<string, any>>({
      query: (interactionData) => ({
        url: "/analytics/interactions",
        method: "POST",
        body: interactionData,
      }),
    }),

    exportAnalytics: builder.query<Blob, void>({
      query: () => ({
        url: "/analytics/export",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetYearRangeQuery,
  useGetProductPerformanceQuery,
  useGetCustomerAnalyticsQuery,
  useGetInteractionAnalyticsQuery,
  useRecordInteractionMutation,
  useExportAnalyticsQuery,
} = analyticsApi;
