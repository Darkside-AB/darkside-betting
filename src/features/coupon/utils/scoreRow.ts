import type { OneXTwo } from "../types";

export function scoreRow(
  row: OneXTwo[],
  weightsByEvent: Record<number, [number, number, number]>
): number {
  let score = 0;

  row.forEach((selection, index) => {
    const eventNumber = index + 1;
    const weights = weightsByEvent[eventNumber];

    if (!weights) return;

    if (selection === 1) score += weights[0];
    if (selection === 2) score += weights[1];
    if (selection === 3) score += weights[2];
  });

  return score;
}
