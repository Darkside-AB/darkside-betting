import type { SelectionValue, OneXTwo, } from "../types/couponDataTypes";

export function deriveSelections(
    valuesByEvent: Record<number, [SelectionValue, SelectionValue, SelectionValue]>
): Record<number, OneXTwo[]> {
    const result: Record<number, OneXTwo[]> = {};

    for (const [event, values] of Object.entries(valuesByEvent)) {
        const [home, draw, away] = values;

        const selections: OneXTwo[] = [];
        if (home > 0) selections.push(1);
        if (draw > 0) selections.push(2);
        if (away > 0) selections.push(3);

        result[Number(event)] = selections;
    }

    return result;
}
