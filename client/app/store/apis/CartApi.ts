import { apiSlice } from "../slices/ApiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: "/cart",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (productData) => ({
        url: "/cart",
        method: "POST",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: (updatedItem) => ({
        url: `/cart/item/${updatedItem.id}`,
        method: "PUT",
        body: { quantity: updatedItem.quantity },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/item/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
