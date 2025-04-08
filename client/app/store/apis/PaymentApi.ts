import { apiSlice } from "../slices/ApiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query({
      query: () => ({
        url: "/payments",
        method: "GET",
      }),
    }),
    // Fetch all payments for the authenticated user
    getUserPayments: builder.query({
      query: () => ({
        url: "/payments",
        method: "GET",
      }),
    }),

    // Fetch a specific payment by ID for the authenticated user
    getPaymentById: builder.query({
      query: (paymentId) => ({
        url: `/payments/${paymentId}`,
        method: "GET",
      }),
    }),

    // Delete a payment by ID for the authenticated user
    deletePayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllPaymentsQuery,
  useGetUserPaymentsQuery,
  useGetPaymentByIdQuery,
  useDeletePaymentMutation,
} = paymentApi;
