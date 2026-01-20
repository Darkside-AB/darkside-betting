import type { EVClassification } from './types';

export function classifyEV(ev: number): EVClassification {
  if (ev >= 1.15) return 'strong';
  if (ev >= 0.95) return 'neutral';
  return 'weak';
}
