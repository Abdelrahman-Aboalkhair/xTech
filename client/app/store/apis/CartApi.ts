import { apiSlice } from "../slices/ApiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserCart: builder.query({
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
        url: "/cart",
        method: "PUT",
        body: updatedItem,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: "/cart",
        method: "DELETE",
        body: { productId },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
