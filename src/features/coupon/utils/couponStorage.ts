import type { CouponStorage } from "../types/couponStorage";
import type { SelectionValue } from "../types/couponDataTypes";

const STORAGE_PREFIX = "coupon";

function storageKey(couponType: string) {
  return `${STORAGE_PREFIX}:${couponType}`;
}

export function loadCouponState(
  couponType: string
): CouponStorage | null {
  const raw = localStorage.getItem(`coupon:${couponType}`);
  if (!raw) return null;

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  // 🔒 Guard against missing data
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !parsed.valuesByEvent ||
    typeof parsed.valuesByEvent !== "object"
  ) {
    return null;
  }

  const normalized: CouponStorage = {
    valuesByEvent: {},
  };

  for (const [event, values] of Object.entries(parsed.valuesByEvent)) {
    if (
      Array.isArray(values) &&
      values.length === 3
    ) {
      normalized.valuesByEvent[Number(event)] = [
        values[0] as SelectionValue,
        values[1] as SelectionValue,
        values[2] as SelectionValue,
      ];
    }
  }

  return normalized;
}


export function saveCouponState(
  couponType: string,
  state: CouponStorage
) {
  localStorage.setItem(
    `coupon:${couponType}`,
    JSON.stringify(state)
  );
}


export function clearCouponState(couponType: string) {
  localStorage.removeItem(storageKey(couponType));
}