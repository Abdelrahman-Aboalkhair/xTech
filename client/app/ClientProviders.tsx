"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient";
import Toast from "./components/feedback/Toast";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      if (pathname !== "/sign-in") {
        localStorage.setItem("isLoggedOut", "true");
        // router.push("/sign-in");
      }
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [router, pathname]);

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        {children}
        <Toast />
      </ApolloProvider>
    </Provider>
  );
}
