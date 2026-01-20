export function calcEventHitProbability(
  signProbs: [number, number, number],
  weights: [number, number, number] // 0–1
): number {
  return (
    signProbs[0] * weights[0] +
    signProbs[1] * weights[1] +
    signProbs[2] * weights[2]
  );
}
