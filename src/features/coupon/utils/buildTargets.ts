import type { OneXTwo } from "../types";

export type Outcome = OneXTwo;

export type EventTargets = Record<
  number,
  Record<Outcome, number>
>;

export function buildTargets(
  weightsByEvent: Record<number, [number, number, number]>,
  targetRows: number
): EventTargets {
  const targets: EventTargets = {};

  for (const eventStr in weightsByEvent) {
    const event = Number(eventStr);
    const [w1, wX, w2] = weightsByEvent[event];
    const total = w1 + wX + w2;

    if (total === 0) {
      targets[event] = { 1: 0, 2: 0, 3: 0 };
      continue;
    }

    targets[event] = {
      1: Math.round((w1 / total) * targetRows),
      2: Math.round((wX / total) * targetRows),
      3: Math.round((w2 / total) * targetRows),
    };
  }

  return targets;
}
