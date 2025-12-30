import type { OneXTwo } from "../types";
import { scoreRow } from "./scoreRow";

export function reduceRowsByWeight(
  rows: OneXTwo[][],
  weightsByEvent: Record<number, [number, number, number]>,
  maxRows: number
): OneXTwo[][] {
  return rows
    .map(row => ({
      row,
      score: scoreRow(row, weightsByEvent),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRows)
    .map(r => r.row);
}
