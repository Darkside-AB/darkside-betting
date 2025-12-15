import { useEffect, useState } from "react";
import { couponApi } from "../services/couponApi";
import type { DrawEvent } from "../types";

export function useCouponLogic() {
  const [events, setEvents] = useState<DrawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEvents, setHasEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await couponApi.getStryktipsetDraws();

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
  }, []);

  return {
    events,
    loading,
    hasEvents,
    error,
  };
}
