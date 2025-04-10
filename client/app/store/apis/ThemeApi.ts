import { apiSlice } from "../slices/ApiSlice";

export const themeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllThemes: builder.query({
      query: () => ({
        url: "/themes",
        method: "GET",
      }),
    }),
    getThemeById: builder.query({
      query: (themeId) => ({
        url: `/themes/${themeId}`,
        method: "GET",
      }),
    }),
    createTheme: builder.mutation({
      query: (newTheme) => ({
        url: "/themes",
        method: "POST",
        body: newTheme,
      }),
    }),
    updateTheme: builder.mutation({
      query: ({ themeId, updatedTheme }) => ({
        url: `/themes/${themeId}`,
        method: "PUT",
        body: updatedTheme,
      }),
    }),
    deleteTheme: builder.mutation({
      query: (themeId) => ({
        url: `/themes/${themeId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllThemesQuery,
  useGetThemeByIdQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
} = themeApi;
