"use client";
import { useCreateInteractionMutation } from "@/app/store/apis/AnalyticsApi";
import { useCallback, useRef } from "react";
import { useGetMeQuery } from "@/app/store/apis/UserApi";

interface TrackInteractionOptions {
  debounceMs?: number;
}

const useTrackInteraction = ({
  debounceMs = 500,
}: TrackInteractionOptions = {}) => {
  const { data } = useGetMeQuery(undefined, {
    skip: typeof window === "undefined", // Avoid fetching on server-side
  });
  const user = data?.user;

  const [createInteraction] = useCreateInteractionMutation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trackInteraction = useCallback(
    async (productId: string | undefined, type: "view" | "click" | "other") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          await createInteraction({
            ...(user?.id && { userId: user.id }), // Only include userId if available
            productId,
            type,
          }).unwrap();
        } catch {
          // Silently ignore errors for guests or failed tracking
        }
      }, debounceMs);
    },
    [user?.id, createInteraction, debounceMs]
  );

  return { trackInteraction, isTracking: !!timeoutRef.current };
};

export default useTrackInteraction;
