import type { CouponRow, MinMaxRule, OneXTwo } from "../types";

// Odds are strings like "7,50"
export interface OddsOneXTwo {
  one: string;
  x: string;
  two: string;
}

// Svenska Folket are numbers like 7, 14, 79
export interface SvenskaFolket {
  one: number;
  x: number;
  two: number;
}

export function cartesian(args: CouponRow[]): CouponRow[] {
  const result: CouponRow[] = [];
  const max = args.length - 1;

  function helper(arr: CouponRow, i: number) {
    for (let j = 0; j < args[i].length; j++) {
      const next = [...arr, args[i][j]] as CouponRow;
      if (i === max) result.push(next);
      else helper(next, i + 1);
    }
  }

  helper([], 0);
  return result;
}

export function buildRowsFromSelections(
  selections: Record<number, OneXTwo[]>
): CouponRow[] {
  return Object.values(selections).filter(row => row.length > 0);
}

export function getValueStrengths(
  odds?: OddsOneXTwo,
  betPercents?: SvenskaFolket
): (number | "X")[] {
  if (!odds || !betPercents) return ["X", "X", "X"];

  const dodds = [
    parseFloat(odds.one.replace(",", ".")),
    parseFloat(odds.x.replace(",", ".")),
    parseFloat(odds.two.replace(",", "."))
  ];

  const betPct = [
    betPercents.one,
    betPercents.x,
    betPercents.two
  ];

  const repaymentRate =
    1 / (1 / dodds[0] + 1 / dodds[1] + 1 / dodds[2]);

  return dodds.map((d, i) => (repaymentRate / d) * 100 - betPct[i]);
}



export function filterRowsByMinMax(
  rows: CouponRow[],
  rules: MinMaxRule[]
): CouponRow[] {
  return rows.filter(row =>
    rules.every(rule => {
      const count = row.filter(v => v === rule.value).length;
      return count >= rule.min && count <= rule.max;
    })
  );
}

export function limitRowsRandomly(
  rows: CouponRow[],
  maxRows: number
): CouponRow[] {
  const copy = [...rows];
  while (copy.length > maxRows) {
    copy.splice(Math.floor(Math.random() * copy.length), 1);
  }
  return copy;
}
