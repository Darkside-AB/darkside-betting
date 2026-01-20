export type HitProbabilities = {
  10: number;
  11: number;
  12: number;
  13: number;
};

export type EVClassification = 'strong' | 'neutral' | 'weak';

export type ExpectedValueResult = {
  ev: number;
  rewardFactor: number;
  probabilities: HitProbabilities;
  classification: EVClassification;
};
