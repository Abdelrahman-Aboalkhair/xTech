import { apiSlice } from "../slices/ApiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getProfile: builder.query({
      query: (id) => ({
        url: `/users/profile/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useGetProfileQuery,
  useGetMeQuery,
  useGetAllUsersQuery,
  useLazyGetMeQuery,
} = userApi;
