import type { DrawEvent } from "../types";
import type { CouponEvent } from "../types";

export function mapDrawEventsToCouponEvents(
  events?: DrawEvent[]
): CouponEvent[] {
  if (!events) return [];

  return events.map(event => ({
    eventNumber: event.eventNumber,
    description: event.eventDescription,
    odds: event.odds,
    svenskaFolket: event.svenskaFolket,
  }));
}
