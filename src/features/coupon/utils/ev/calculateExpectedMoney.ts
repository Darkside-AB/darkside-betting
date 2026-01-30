import { PRIZE_FRACTION } from "./evConfig";
import type { HitProbabilities } from './types';

export function calculateExpectedMoney(
  probabilities: HitProbabilities,
  pool: number,
  couponStrength: number
) {
  let ev = 0;

  for (const k of [10, 11, 12, 13] as const) {
    const p = probabilities[k] || 0;
    const fraction = PRIZE_FRACTION[k];

    const expectedPrize =
      pool * fraction * couponStrength;

    ev += p * expectedPrize;
  }

  return ev;
}
