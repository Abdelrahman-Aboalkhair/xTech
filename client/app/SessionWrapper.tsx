"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "./store/apis/UserApi";
import { clearUser, setUser } from "./store/slices/AuthSlice";
import CustomLoader from "./components/feedback/CustomLoader";
import { useAppDispatch, useAppSelector } from "./store/hooks";

interface SessionWrapperProps {
  children: React.ReactNode;
}

const EXCLUDED_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user); // Check if user exists in Redux
  const shouldSkip = EXCLUDED_ROUTES.includes(pathname) || !!user; // Skip if on excluded route or user is set
  console.log("shouldSkip => ", shouldSkip);

  const { data, isFetching, error } = useGetMeQuery(undefined, {
    skip: shouldSkip,
  });

  useEffect(() => {
    if (data && !user) {
      dispatch(setUser(data)); // Set user only if not already set
    } else if (error && !shouldSkip) {
      dispatch(clearUser()); // Clear user on error (e.g., invalid token)
      if (!EXCLUDED_ROUTES.includes(pathname)) {
        router.push("/sign-in");
      }
    }
  }, [data, error, shouldSkip, dispatch, user]);

  if (isFetching && !user) {
    return <CustomLoader />;
  }

  return <>{children}</>;
};

export default SessionWrapper;
