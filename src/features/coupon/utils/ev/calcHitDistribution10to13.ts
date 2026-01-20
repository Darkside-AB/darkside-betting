import { calcMeanAndVariance, probExactlyK } from "./distribution";
export function calcHitDistribution10to13(ps: number[]) {
  const { mean, variance } = calcMeanAndVariance(ps);

  return {
    10: probExactlyK(10, mean, variance),
    11: probExactlyK(11, mean, variance),
    12: probExactlyK(12, mean, variance),
    13: probExactlyK(13, mean, variance)
  };
}
