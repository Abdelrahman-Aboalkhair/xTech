import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/app/utils/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "@/app/store/slices/AuthSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "@/app/assets/icons/google.png";

const GoogleSignup = ({ onError }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const signup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosInstance.post("/auth/google-signup", {
          access_token: tokenResponse.access_token,
        });

        dispatch(setCredentials(res.data));
        router.push("/");
      } catch (error) {
        onError(
          error?.response?.data?.message ?? "An error occurred while signing in"
        );
        console.error("Google signup failed", error);
      }
    },
    onError: (error) => {
      console.error("Google signup failed", error);
    },
  });

  return (
    <button
      onClick={() => signup()}
      className="flex items-center justify-center gap-2 border-[2.8px] border-gray-200/90 text-black py-4 rounded-md w-full"
    >
      <Image
        src={GoogleIcon}
        width={26}
        height={26}
        alt="Google"
        className="ml-2"
      />
      Sign up with Google
    </button>
  );
};

export default GoogleSignup;
