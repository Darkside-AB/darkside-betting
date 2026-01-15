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

export function calculateCouponStrengthFromEvents<
    TOdds,
    TSvenskaFolket
>(
    events: {
        eventNumber: number;
        odds?: TOdds;
        svenskaFolket?: TSvenskaFolket;
    }[],
    weightsByEvent: Record<number, SignWeights>,
    getNumericValueStrengths: (
        odds: TOdds,
        svenskaFolket: TSvenskaFolket
    ) => SignStrengths
): number {
    return events.reduce((product, event) => {
        // Narrow types: only call function if both are defined
        const { odds, svenskaFolket } = event;
        if (odds == null || svenskaFolket == null) return product;

        const weights = weightsByEvent[event.eventNumber];
        if (!weights) return product;

        // TS now knows odds and svenskaFolket are defined
        const strengths = getNumericValueStrengths(odds, svenskaFolket);

        const eventStrength = calculateEventStrength(strengths, weights);

        return product * eventStrength;
    }, 1);
}


