import type { CouponRow } from "../types/couponDataTypes";

type SignKey = "1" | "X" | "2";

export function countSigns(row: CouponRow): Record<SignKey, number> {
  const counts: Record<SignKey, number> = {
    "1": 0,
    "X": 0,
    "2": 0,
  };

  for (const value of row) {
    switch (value) {
      case 1:
        counts["1"]++;
        break;
      case 2:
        counts["X"]++;
        break;
      case 3:
        counts["2"]++;
        break;
    }
  }

  return counts;
}



export function matchesSignRanges(
  row: CouponRow,
  ranges: Record<"1" | "X" | "2", [number, number]>
) {
  const counts = countSigns(row);

  return (["1", "X", "2"] as const).every(sign => {
    const [min, max] = ranges[sign];
    return counts[sign] >= min && counts[sign] <= max;
  });
}

