import { PRIZE_FRACTION } from './evConfig';
import { classifyEV } from './classifyEV';
import type { HitProbabilities, ExpectedValueResult } from './types';

// baseline is now the rawEV for an "average" row
const BASELINE_EV = 2.44e-8;

export function calculateExpectedValue(
  probabilities: HitProbabilities,
  couponStrength: number
): ExpectedValueResult {
  const rawEV =
    (probabilities[10] || 0) * PRIZE_FRACTION[10] +
    (probabilities[11] || 0) * PRIZE_FRACTION[11] +
    (probabilities[12] || 0) * PRIZE_FRACTION[12] +
    (probabilities[13] || 0) * PRIZE_FRACTION[13];

  const ev = (rawEV / BASELINE_EV) * couponStrength;

  return {
    ev,
    rewardFactor: couponStrength,
    probabilities,
    classification: classifyEV(ev),
  };
}
