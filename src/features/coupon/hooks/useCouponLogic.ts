import { useEffect, useState } from "react";
import { couponApi } from "../services/couponApi";
import type { DrawEvent } from "../types";

type CouponType = "europatipset" | "stryktipset" | undefined;

export function useCouponLogic(couponType: CouponType) {
  const [events, setEvents] = useState<DrawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEvents, setHasEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!couponType) return;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        console.log(`Loading data for ${couponType}...`);
        const res =
          couponType === "stryktipset"
            ? await couponApi.getStryktipsetDraws()
            : await couponApi.getEuropatipsetDraws();

            console.log("API response:", res);

        const drawEvents =
          res.data.draws?.[0]?.drawEvents ?? [];

        setEvents(drawEvents);
        setHasEvents(drawEvents.length > 0);
      } catch (err) {
        console.error(err);
        setError("Failed to connect to API");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [couponType]);

  return {
    events,
    loading,
    hasEvents,
    error,
  };
}
