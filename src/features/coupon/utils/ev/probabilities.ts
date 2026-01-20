import type { SvenskaFolket } from "../../types/couponDataTypes";

export function calcNormalizedSignProbs(
  valueStrengths: (number | "X")[],
  streck?: SvenskaFolket
): [number, number, number] {
  // Neutral fallback
  if (!streck) return [1 / 3, 1 / 3, 1 / 3];

  const v = valueStrengths.map(x => (x === "X" ? 1 : x));

  const q = [
    streck.one / 100,
    streck.x / 100,
    streck.two / 100
  ];

  const denom = v[0] * q[0] + v[1] * q[1] + v[2] * q[2];

  if (denom === 0) return [1 / 3, 1 / 3, 1 / 3];

  return [
    (v[0] * q[0]) / denom,
    (v[1] * q[1]) / denom,
    (v[2] * q[2]) / denom
  ];
}
