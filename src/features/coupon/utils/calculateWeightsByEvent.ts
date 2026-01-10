import type { SelectionValue } from "../types/couponDataTypes";

export function calculateWeightsByEvent(
    valuesByEvent: Record<number, [SelectionValue, SelectionValue, SelectionValue]>
): Record<number, [number, number, number]> {
    const result: Record<number, [number, number, number]> = {};

    for (const eventNumber in valuesByEvent) {
        const values = valuesByEvent[eventNumber];
        const total = values.reduce<number>((sum, v) => sum + v, 0);

        result[Number(eventNumber)] =
            total === 0
                ? [0, 0, 0]
                : (values.map(v =>
                    Math.round((v / total) * 100)
                ) as [number, number, number]);
    }

    return result;
}
