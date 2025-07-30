"use client";

import CustomLoader from "./components/feedback/CustomLoader";
import { useEffect } from "react";
import { useCheckAuthMutation } from "./store/apis/AuthApi";
import { usePathname } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ["/sign-in", "/sign-up", "password-reset", "verify-email"];

  const isAuthRoute = authRoutes.includes(pathname);

  const [checkAuth, { isLoading }] = useCheckAuthMutation();

  useEffect(() => {
    if (!isAuthRoute) {
      checkAuth()
        .unwrap()
        .catch(() => {});
    }
  }, [checkAuth, isAuthRoute]);

  if (!isAuthRoute && isLoading) {
    return <CustomLoader />;
  }

  return <>{children}</>;
}
