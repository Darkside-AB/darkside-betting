export function normalizeWeights(
  weights: [number, number, number]
): [number, number, number] {
  const sum = weights[0] + weights[1] + weights[2];

  if (sum === 0) return [0, 0, 0];

  return [
    weights[0] / sum,
    weights[1] / sum,
    weights[2] / sum
  ];
}
