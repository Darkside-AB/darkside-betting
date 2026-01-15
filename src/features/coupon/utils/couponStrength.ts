export type SignStrengths = [number, number, number];
export type SignWeights = [number, number, number];

export function calculateEventStrength(
  strengths: SignStrengths,
  weights: SignWeights
): number {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // No selected signs → neutral event
  if (totalWeight === 0) return 1;

  return strengths.reduce((sum, strength, i) => {
    return sum + strength * (weights[i] / totalWeight);
  }, 0);
}

export function calculateCouponStrength(
  eventStrengths: number[]
): number {
  return eventStrengths.reduce(
    (product, strength) => product * strength,
    1
  );
}

export function calculateCouponStrengthFromEvents(
  events: {
    eventNumber: number;
    odds?: unknown;
    svenskaFolket?: unknown;
  }[],
  weightsByEvent: Record<number, SignWeights>,
  getValueStrengths: (
    odds: unknown,
    svenskaFolket: unknown
  ) => SignStrengths
): number {
  return events.reduce((product, event) => {
    if (!event.odds || !event.svenskaFolket) return product;

    const weights = weightsByEvent[event.eventNumber];
    if (!weights) return product;

    const strengths = getValueStrengths(
      event.odds,
      event.svenskaFolket
    );

    const eventStrength = calculateEventStrength(
      strengths,
      weights
    );

    return product * eventStrength;
  }, 1);
}
