import { apiSlice } from "../slices/ApiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddresses: builder.query({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),
    }),
    // Fetch all addresses for the authenticated user
    getUserAddresses: builder.query({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),
    }),

    // Fetch a specific address by ID for the authenticated user
    getAddressById: builder.query({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: "GET",
      }),
    }),

    // Delete an address by ID for the authenticated user
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllAddressesQuery,
  useGetUserAddressesQuery,
  useGetAddressByIdQuery,
  useDeleteAddressMutation,
} = addressApi;
