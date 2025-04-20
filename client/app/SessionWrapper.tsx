"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "./store/apis/UserApi";
import { clearUser, setUser } from "./store/slices/AuthSlice";
import CustomLoader from "./components/feedback/CustomLoader";
import { useAppDispatch, useAppSelector } from "./store/hooks";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/orders", "/checkout"];

const EXCLUDED_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

const PUBLIC_ROUTES = [
  "/",
  "/cart",
  "/shop",
  "/product/:slug",
  "/about",
  "/contact",
];

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isExcludedRoute = EXCLUDED_ROUTES.includes(pathname);
  const shouldSkip = isExcludedRoute || isPublicRoute || !!user;

  const { data, isFetching, error } = useGetMeQuery(undefined, {
    skip: shouldSkip,
  });

  useEffect(() => {
    if (data && !user) {
      dispatch(setUser(data));
    } else if (error && !shouldSkip) {
      dispatch(clearUser());
      if (!isExcludedRoute) {
        if (PROTECTED_ROUTES.includes(pathname)) {
          router.push("/sign-in");
        }
      }
    }
  }, [data, error, shouldSkip, dispatch, user, isExcludedRoute]);

  if (isFetching && !user && !isPublicRoute) {
    return <CustomLoader />;
  }

  return <>{children}</>;
};

export default SessionWrapper;
