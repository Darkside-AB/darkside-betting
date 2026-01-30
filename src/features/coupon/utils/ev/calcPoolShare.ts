import type { OneXTwo } from "../../types/couponDataTypes";
import type { SvenskaFolket } from "../../types/couponDataTypes";

export function calcRowPopularity(
    row: OneXTwo[],
    svenskaFolketByEvent: Record<number, SvenskaFolket>
): number {
    return row.reduce<number>((acc, sign, index) => {
        const folk = svenskaFolketByEvent[index + 1];
        if (!folk) return acc;

        let p: number;

        if (sign === 1) p = folk.one;
        else if (sign === 2) p = folk.x;
        else p = folk.two; // sign === 3

        return acc * (p / 100);
    }, 1);
}

export function calcPoolShareForCoupon(
    rows: OneXTwo[][],
    svenskaFolketByEvent: Record<number, SvenskaFolket>,
    turnover: number
): number {
    if (!rows.length || turnover <= 0) return 0;

    const avgPopularity =
        rows.reduce<number>((sum, row) => {
            return sum + calcRowPopularity(row, svenskaFolketByEvent);
        }, 0) / rows.length;

    const expectedWinners = turnover * avgPopularity;

    return expectedWinners > 0 ? 1 / expectedWinners : 0;
}