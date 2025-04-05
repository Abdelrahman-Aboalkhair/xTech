"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import CustomLoader from "@/app/components/feedback/CustomLoader";

const OAuthSuccessPage = () => {
  const { fetchUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        await fetchUserData();
        router.replace("/");
      } catch (err) {
        console.error("OAuth fetch failed", err);
        router.replace("/sign-in");
      }
    };

    getUser();
  }, []);

  return <CustomLoader />;
};

export default OAuthSuccessPage;
