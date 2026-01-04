import type { CouponRow, OneXTwo } from "../types";

export type CouponType = "europatipset" | "stryktipset";

function mapToSymbol(value: OneXTwo): "1" | "X" | "2" {
  switch (value) {
    case 1:
      return "1";
    case 2:
      return "X";
    case 3:
      return "2";
  }
}

function getHeader(couponType: CouponType): string {
  return couponType === "europatipset"
    ? "Europatipset"
    : "Stryktipset";
}

function getRowPrefix(couponType: CouponType): "E" | "E" {
  return couponType === "europatipset" ? "E" : "E";
}

export function formatRowsForSvenskaSpel(
  rows: CouponRow[],
  couponType: CouponType
): string {
  const header = getHeader(couponType);
  const prefix = getRowPrefix(couponType);

  const formattedRows = rows.map(row => {
    const symbols = row.map(mapToSymbol);
    return `${prefix},${symbols.join(",")}`;
  });

  return [header, ...formattedRows].join("\n");
}
