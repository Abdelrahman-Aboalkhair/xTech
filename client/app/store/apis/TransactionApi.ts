import { apiSlice } from "../slices/ApiSlice";

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: () => "/transactions",
    }),
    getTransaction: builder.query({
      query: (id) => `/transactions/${id}`,
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionQuery,
  useDeleteTransactionMutation,
} = transactionApi;
