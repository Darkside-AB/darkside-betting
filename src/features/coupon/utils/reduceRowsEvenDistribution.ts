import type { OneXTwo } from "../types/couponDataTypes";
import { buildTargets } from "./buildTargets";

export function reduceRowsEvenDistribution(
  allRows: OneXTwo[][],
  weightsByEvent: Record<number, [number, number, number]>,
  targetRows: number
): OneXTwo[][] {
  if (allRows.length <= targetRows) return allRows;

  const targets = buildTargets(weightsByEvent, targetRows);

  const current: Record<number, Record<OneXTwo, number>> = {};
  const selected: OneXTwo[][] = [];
  const used = new Set<number>();

  for (let e = 1; e <= allRows[0].length; e++) {
    current[e] = { 1: 0, 2: 0, 3: 0 };
  }

  while (selected.length < targetRows) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < allRows.length; i++) {
      if (used.has(i)) continue;

      let score = 0;
      const row = allRows[i];

      for (let e = 0; e < row.length; e++) {
        const event = e + 1;
        const outcome = row[e];

        const deficit =
          targets[event][outcome] - current[event][outcome];

        if (deficit > 0) score += deficit;
      }

      score += Math.random() * 0.001;

      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) break;

    const chosen = allRows[bestIdx];
    selected.push(chosen);
    used.add(bestIdx);

    for (let e = 0; e < chosen.length; e++) {
      current[e + 1][chosen[e]]++;
    }
  }

  return selected;
}
