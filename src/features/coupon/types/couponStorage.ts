import type { OneXTwo } from "../types";

export interface CouponStorage {
  selections: Record<number, OneXTwo[]>;
  weightsByEvent: Record<number, [number, number, number]>;
}
