import { useEffect, useState } from "react";
import { couponApi } from "../services/couponApi";
import type { DrawEvent } from "../types/couponDataTypes";

type CouponType = "europatipset" | "stryktipset" | undefined;

// 👇 optional backtest data (same shape as API response)
export function useCouponLogic(
  couponType: CouponType,
  backtestData?: any,
  reloadKey?: number
) {
  const [events, setEvents] = useState<DrawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEvents, setHasEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNetSale, setCurrentNetSale] = useState<number>(0);
  const [regCloseDescription, setRegCloseDescription] = useState<string | null>(null);

  // ✅ unified extractor for API + backtest JSON
  function extractDraw(source: any) {
    // supports:
    // API: res.data.draws[0]
    // JSON: data.draws[0]
    const draw =
      source?.data?.draws?.[0] ??
      source?.draws?.[0];

    const drawEvents = draw?.drawEvents ?? [];
    const netSale = draw?.currentNetSale ?? null;
    const netSaleNumber = netSale ? Number(netSale.replace(",", ".")) : 0;
    const closeDescription = draw?.regCloseDescription ?? null;

    return {
      drawEvents,
      netSaleNumber,
      closeDescription,
    };
  }

  useEffect(() => {
    if (!couponType && !backtestData) return;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        let source;

        // ✅ BACKTEST MODE
        if (backtestData) {
          console.log("Loading backtest data...");
          source = backtestData;
        }
        // ✅ API MODE
        else {
          console.log(`Loading data for ${couponType}...`);
          source =
            couponType === "stryktipset"
              ? await couponApi.getStryktipsetDraws()
              : await couponApi.getEuropatipsetDraws();
        }

        console.log("Source:", source);

        const { drawEvents, netSaleNumber, closeDescription } =
          extractDraw(source);

        setEvents(drawEvents);
        setCurrentNetSale(netSaleNumber);
        setRegCloseDescription(closeDescription);
        setHasEvents(drawEvents.length > 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load draw data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [couponType, backtestData, reloadKey]);

  return {
    regCloseDescription,
    currentNetSale,
    events,
    loading,
    hasEvents,
    error,
  };
}
