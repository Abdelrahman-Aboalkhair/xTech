"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/app/store/apis/UserApi";
import CustomLoader from "../feedback/CustomLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/sign-in",
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = "/forbidden",
}: ProtectedRouteProps) {
  const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: isLoggedOut,
  });
  const user = data?.user;
  const router = useRouter();

  // Authorization checks
  const hasRequiredRole =
    !requiredRoles.length ||
    (user?.role ? requiredRoles.includes(user.role) : false);
  const hasRequiredPermissions =
    !requiredPermissions.length ||
    requiredPermissions.every(
      (perm) => user?.permissions?.includes(perm) ?? false
    );

  useEffect(() => {
    if (isLoading || isLoggedOut) return;

    if (isError || !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        localStorage.setItem("redirectAfterLogin", currentPath);
      }
      localStorage.setItem("isLoggedOut", "true");
      router.push(redirectTo);
      return;
    }

    if (!hasRequiredRole || !hasRequiredPermissions) {
      router.push(fallbackPath);
    }
  }, [
    isLoading,
    isError,
    isLoggedOut,
    user,
    hasRequiredRole,
    hasRequiredPermissions,
    router,
    redirectTo,
    fallbackPath,
  ]);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (
    isLoggedOut ||
    isError ||
    !user ||
    !hasRequiredRole ||
    !hasRequiredPermissions
  ) {
    return null;
  }

  return <>{children}</>;
}
