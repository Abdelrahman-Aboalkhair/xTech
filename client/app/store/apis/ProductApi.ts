import { apiSlice } from "../slices/ApiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => {
        let queryString = "";

        if (params) {
          const {
            searchQuery,
            sort,
            limit,
            categories,
            page,
            featured,
            bestSelling,
          } = params;

          // Handle search query
          if (searchQuery) queryString += `searchQuery=${searchQuery}&`;

          // Handle sort option
          if (sort) queryString += `sort=${sort}&`;

          // Handle limit for pagination
          if (limit) queryString += `limit=${limit}&`;

          // Handle category filtering, create query string like ?category=electronics
          if (categories && categories.length > 0) {
            queryString += `category=${categories.join(",")}&`;
          }

          // Handle pagination
          if (page) queryString += `page=${page}&`;

          // Handle boolean flags (e.g., featured, bestSelling)
          if (featured) queryString += `featured=true&`;
          if (bestSelling) queryString += `bestSelling=true&`;

          // Remove the trailing "&" from the query string
          if (queryString.endsWith("&")) {
            queryString = queryString.slice(0, -1);
          }
        }

        console.log("queryString: ", queryString);

        return {
          url: `/products?${queryString}`,
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
