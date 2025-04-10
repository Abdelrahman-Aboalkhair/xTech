import { apiSlice } from "../slices/ApiSlice";

export const widgetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroPromo: builder.query<any, void>({
      query: () => "widgets/hero-promo",
    }),
    getTopbar: builder.query<any, void>({
      query: () => "widgets/topbar",
    }),
    getAllWidgets: builder.query({
      query: () => ({
        url: "/widgets",
        method: "GET",
      }),
    }),
    getWidgetById: builder.query({
      query: (widgetId) => ({
        url: `/widgets/${widgetId}`,
        method: "GET",
      }),
    }),
    createWidget: builder.mutation({
      query: (newWidget) => ({
        url: "/widgets",
        method: "POST",
        body: newWidget,
      }),
    }),
    updateWidget: builder.mutation({
      query: ({ widgetId, updatedWidget }) => ({
        url: `/widgets/${widgetId}`,
        method: "PUT",
        body: updatedWidget,
      }),
    }),
    deleteWidget: builder.mutation({
      query: (widgetId) => ({
        url: `/widgets/${widgetId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetHeroPromoQuery,
  useGetTopbarQuery,
  useGetAllWidgetsQuery,
  useGetWidgetByIdQuery,
  useCreateWidgetMutation,
  useUpdateWidgetMutation,
  useDeleteWidgetMutation,
} = widgetApi;
