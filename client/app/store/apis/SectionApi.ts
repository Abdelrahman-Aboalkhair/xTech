import { apiSlice } from "../slices/ApiSlice";

export const sectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSections: builder.query({
      query: () => ({
        url: "/sections",
        method: "GET",
      }),
    }),
    getSectionById: builder.query({
      query: (sectionId) => ({
        url: `/sections/${sectionId}`,
        method: "GET",
      }),
    }),
    createSection: builder.mutation({
      query: (newSection) => ({
        url: "/sections",
        method: "POST",
        body: newSection,
      }),
    }),
    updateSection: builder.mutation({
      query: ({ sectionId, updatedSection }) => ({
        url: `/sections/${sectionId}`,
        method: "PUT",
        body: updatedSection,
      }),
    }),
    deleteSection: builder.mutation({
      query: (sectionId) => ({
        url: `/sections/${sectionId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionApi;
