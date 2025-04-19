"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "./store/apis/UserApi";
import { clearUser, setUser } from "./store/slices/AuthSlice";
import CustomLoader from "./components/feedback/CustomLoader";
import { useAppDispatch } from "./store/hooks";

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
  const shouldSkip = EXCLUDED_ROUTES.includes(pathname);
  console.log("shouldSkip => ", shouldSkip);
  const { data, isFetching, error } = useGetMeQuery(undefined, {
    skip: shouldSkip,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    } else if (error && !shouldSkip) {
      dispatch(clearUser());
    }
  }, [data, error, shouldSkip, dispatch]);

  if (isFetching) {
    return <CustomLoader />;
  }

  return <>{children}</>;
};

export default SessionWrapper;
