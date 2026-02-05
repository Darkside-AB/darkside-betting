import type { OneXTwo } from "../types/couponDataTypes";

export function countHits(row: OneXTwo[], winningRow: OneXTwo[]) {
  let hits = 0;

  for (let i = 0; i < row.length; i++) {
    if (row[i] === winningRow[i]) {
      hits++;
    }
  }

  return hits;
}

export function evaluateBacktest(
  rows: OneXTwo[][],
  winningRow: OneXTwo[]
): { hits10: number; hits11: number; hits12: number; hits13: number } {
  const result = {
    hits10: 0,
    hits11: 0,
    hits12: 0,
    hits13: 0,
  };

  for (const row of rows) {
    const hits = countHits(row, winningRow);

    if (hits === 10) result.hits10++;
    else if (hits === 11) result.hits11++;
    else if (hits === 12) result.hits12++;
    else if (hits === 13) result.hits13++;
  }

  return result;
}


