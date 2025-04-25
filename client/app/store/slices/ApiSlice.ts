import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const publicEndpoints = [
  "/auth/sign-in",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Extract the URL from args
  const url = typeof args === "string" ? args : args.url;
  // List of public API endpoints that don't require authentication

  let result = await baseQuery(args, api, extraOptions);

  // Check if the request is to a public endpoint
  const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    url.endsWith(endpoint)
  );

  if (result.error?.status === 401 && !isPublicEndpoint) {
    console.log(
      "⚠️ Received 401 for protected endpoint, attempting token refresh..."
    );

    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log("✅ Token refresh successful, retrying original request...");
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn("❌ Token refresh failed, marking session as logged out...");
      localStorage.setItem("isLoggedOut", "true");
      window.dispatchEvent(new CustomEvent("unauthorized"));
      return { error: { status: 401, data: "Unauthorized" } };
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
    "Chat",
  ],
  endpoints: () => ({}),
});
