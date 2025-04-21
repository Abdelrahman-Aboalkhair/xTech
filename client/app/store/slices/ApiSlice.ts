import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    console.log("⚠️ Received 401, attempting token refresh...");

    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn("Unauthorized");
      // api.dispatch(clearUser());
      // window.dispatchEvent(new CustomEvent("unauthorized"));
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Product",
    "Category",
    "Cart",
    "Order",
    "Review",
    "Section",
    "Transactions",
    "Logs",
  ],
  endpoints: () => ({}),
});
