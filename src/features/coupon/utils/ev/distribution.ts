import erf from 'compute-erf';

export function calcMeanAndVariance(ps: number[]) {
  let mean = 0;
  let variance = 0;

  for (const p of ps) {
    mean += p;
    variance += p * (1 - p);
  }

  return { mean, variance };
}

function normalCDF(x: number): number {
  // Use the imported 'erf' function instead of Math.erf
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

export function probExactlyK(
  k: number,
  mean: number,
  variance: number
): number {
  const sd = Math.sqrt(variance);
  if (sd === 0) return 0;

  // continuity correction
  const z1 = (k - 0.5 - mean) / sd;
  const z2 = (k + 0.5 - mean) / sd;

  return normalCDF(z2) - normalCDF(z1);
}
