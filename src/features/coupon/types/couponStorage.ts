import type { SelectionValue } from "./couponDataTypes";

export interface CouponStorage {
  valuesByEvent: Record<
    number,
    [SelectionValue, SelectionValue, SelectionValue]
  >;
}