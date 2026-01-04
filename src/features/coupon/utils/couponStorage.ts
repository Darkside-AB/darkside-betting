import type { CouponStorage } from "../types/couponStorage";

const STORAGE_PREFIX = "coupon";

function storageKey(couponType: string) {
  return `${STORAGE_PREFIX}:${couponType}`;
}

export function loadCouponState(
  couponType: string
): CouponStorage | null {
  try {
    const raw = localStorage.getItem(storageKey(couponType));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCouponState(
  couponType: string,
  state: CouponStorage
) {
  localStorage.setItem(
    storageKey(couponType),
    JSON.stringify(state)
  );
}

export function clearCouponState(couponType: string) {
  localStorage.removeItem(storageKey(couponType));
}