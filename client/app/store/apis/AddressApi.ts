import { apiSlice } from "../slices/ApiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddresses: builder.query({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),
    }),
    getUserAddresses: builder.query({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),
    }),

    getAddressById: builder.query({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: "GET",
      }),
    }),

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
