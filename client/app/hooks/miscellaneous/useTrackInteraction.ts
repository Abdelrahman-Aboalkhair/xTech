"use client";
import { useCreateInteractionMutation } from "@/app/store/apis/AnalyticsApi";
import { useCallback, useRef } from "react";
// import { useGetMeQuery } from "@/app/store/apis/UserApi";

interface TrackInteractionOptions {
  debounceMs?: number;
}

const useTrackInteraction = ({
  debounceMs = 500,
}: TrackInteractionOptions = {}) => {
  // const { data } = useGetMeQuery(undefined);
  const user = { id: "3423" };

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
            userId: user.id,
            productId,
            type,
          }).unwrap();
        } catch (error) {
          console.error("Failed to track interaction:", error);
        }
      }, debounceMs);
    },
    [user?.id, createInteraction, debounceMs]
  );

  return { trackInteraction, isTracking: !!timeoutRef.current };
};

export default useTrackInteraction;
