import { apiSlice } from "../slices/ApiSlice";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => {
        console.log("incoming params: ", params);
        const queryString = new URLSearchParams();

        if (params) {
          const {
            searchQuery,
            sort,
            limit,
            category, // category is now a string, not an array
            page,
            featured,
            bestselling,
          } = params;

          if (searchQuery) queryString.set("searchQuery", searchQuery);
          if (sort) queryString.set("sort", sort);
          if (limit) queryString.set("limit", limit);
          if (category) queryString.set("category", category); // now handled as a string
          if (page) queryString.set("page", page);
          if (featured) queryString.set("featured", "true");
          if (bestselling) queryString.set("bestselling", "true");
        }

        console.log("queryString: ", queryString.toString());

        return {
          url: `/products?${queryString.toString()}`,
          method: "GET",
        };
      },
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/slug/${slug}`,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
