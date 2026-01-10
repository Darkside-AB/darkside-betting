import type { OneXTwo } from "../types/couponDataTypes";

export function calculateEventWeights(
  rows: OneXTwo[][]
): Record<number, [number, number, number]> {
  const result: Record<number, [number, number, number]> = {};

  if (rows.length === 0) return result;

  const eventsCount = rows[0].length;

  for (let eventIndex = 0; eventIndex < eventsCount; eventIndex++) {
    let count1 = 0;
    let countX = 0;
    let count2 = 0;

    rows.forEach(row => {
      const selection = row[eventIndex];

      if (selection === 1) count1++;
      if (selection === 2) countX++;
      if (selection === 3) count2++;
    });

    const total = rows.length;

    result[eventIndex + 1] = [
      Math.round((count1 / total) * 100),
      Math.round((countX / total) * 100),
      Math.round((count2 / total) * 100),
    ];
  }

  return result;
}
