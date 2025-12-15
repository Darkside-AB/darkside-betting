import type { CouponRow, MinMaxRule, OneXTwo } from "../types";

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

export function buildRowsFromLocalStorage(eventsCount = 13): CouponRow[] {
  const rows: CouponRow[] = [];

  for (let i = 1; i <= eventsCount; i++) {
    const row: CouponRow = [];
    for (let j = 1; j <= 3; j++) {
      if (Number(localStorage.getItem(`button ${i}${j}`)) > 0) {
        row.push(j as OneXTwo);
      }
    }
    if (row.length > 0) rows.push(row);
  }

  return rows;
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
