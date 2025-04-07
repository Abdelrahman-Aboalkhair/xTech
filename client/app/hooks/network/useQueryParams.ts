"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (newParams: Record<string, string | number | boolean | null>) => {
      const query = Object.fromEntries(searchParams.entries());
      const updatedQuery = { ...query, ...newParams };
      const params = new URLSearchParams();

      Object.keys(updatedQuery).forEach((key) => {
        const value = updatedQuery[key];
        if (value !== false && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      const search = params.toString();
      const queryString = search ? `?${search}` : "";

      router.push(`${pathname}${queryString}`);
    },
    [pathname, searchParams, router]
  );

  return { query: Object.fromEntries(searchParams.entries()), updateQuery };
};

export default useQueryParams;
