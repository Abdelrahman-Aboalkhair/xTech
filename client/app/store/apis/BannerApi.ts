import { apiSlice } from "../slices/ApiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
    }),
    getBannerById: builder.query({
      query: (bannerId) => ({
        url: `/banners/${bannerId}`,
        method: "GET",
      }),
    }),
    createBanner: builder.mutation({
      query: (newBanner) => ({
        url: "/banners",
        method: "POST",
        body: newBanner,
      }),
    }),
    updateBanner: builder.mutation({
      query: ({ bannerId, updatedBanner }) => ({
        url: `/banners/${bannerId}`,
        method: "PUT",
        body: updatedBanner,
      }),
    }),
    deleteBanner: builder.mutation({
      query: (bannerId) => ({
        url: `/banners/${bannerId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
