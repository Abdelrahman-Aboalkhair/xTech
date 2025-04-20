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
// const PUBLIC_ROUTES = [
//   "/",
//   "/cart",
//   "/shop",
//   "/product/:slug",
//   "/about",
//   "/contact",
// ];

const matchPath = (routes: string[], path: string) => {
  return routes.some((route) => {
    if (route.includes("/:")) {
      const base = route.split("/:")[0];
      return path.startsWith(base);
    }
    return route === path;
  });
};

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const isExcludedRoute = matchPath(EXCLUDED_ROUTES, pathname);
  const isProtectedRoute = matchPath(PROTECTED_ROUTES, pathname);
  const shouldSkip = isExcludedRoute || !!user;

  const { data, isFetching, error } = useGetMeQuery(undefined, {
    skip: shouldSkip,
  });

  // Handle unauthorized event globally
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(clearUser());
      if (pathname !== "/sign-in") {
        router.push("/sign-in");
      }
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [dispatch, router, pathname]);

  // Handle user data
  useEffect(() => {
    if (data && !user) {
      dispatch(setUser(data));
    } else if (error && !shouldSkip && isProtectedRoute) {
      dispatch(clearUser());
      router.push("/sign-in");
    }
  }, [data, error, shouldSkip, dispatch, user, isProtectedRoute, router]);

  if (isFetching && !user && isProtectedRoute) {
    return <CustomLoader />;
  }

  return <>{children}</>;
};

export default SessionWrapper;
