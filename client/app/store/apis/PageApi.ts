import { apiSlice } from "../slices/ApiSlice";

export const pageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPages: builder.query({
      query: () => ({
        url: "/pages",
        method: "GET",
      }),
    }),
    getPageById: builder.query({
      query: (pageId) => ({
        url: `/pages/${pageId}`,
        method: "GET",
      }),
    }),
    createPage: builder.mutation({
      query: (newPage) => ({
        url: "/pages",
        method: "POST",
        body: newPage,
      }),
    }),
    updatePage: builder.mutation({
      query: ({ pageId, updatedPage }) => ({
        url: `/pages/${pageId}`,
        method: "PUT",
        body: updatedPage,
      }),
    }),
    deletePage: builder.mutation({
      query: (pageId) => ({
        url: `/pages/${pageId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllPagesQuery,
  useGetPageByIdQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pageApi;
