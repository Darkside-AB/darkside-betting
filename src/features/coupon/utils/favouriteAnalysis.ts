import type { OneXTwo, CouponEvent } from "../types/couponDataTypes";

export function evaluateFavouriteProfile(
    winningRow: OneXTwo[],
    events: CouponEvent[]
) {
    let favouriteCount = 0;
    let valueCount = 0;
    let skrallCount = 0;
    let totalMatches = 0;

    let oneCount = 0;
    let xCount = 0;
    let twoCount = 0

    events.forEach((event, index) => {
        if (!event.odds) return;

        const one = Number(event.odds.one.replace(",", "."));
        const x = Number(event.odds.x.replace(",", "."));
        const two = Number(event.odds.two.replace(",", "."));

        if (isNaN(one) || isNaN(x) || isNaN(two)) return;

        totalMatches++;

        const minOdd = Math.min(one, x, two);
        const maxOdd = Math.max(one, x, two);

        let favourite: OneXTwo;
        let skrall: OneXTwo;

        if (minOdd === one) favourite = 1;
        else if (minOdd === x) favourite = 2;
        else favourite = 3;

        if (maxOdd === one) skrall = 1;
        else if (maxOdd === x) skrall = 2;
        else skrall = 3;

        const outcome = winningRow[index];

        // count 1 X 2
        if (outcome === 1) oneCount++;
        if (outcome === 2) xCount++;
        if (outcome === 3) twoCount++;

        console.log("OneCount: " + oneCount)

        // favourite outcome
        if (outcome === favourite) {
            favouriteCount++;
        }

        // value outcome (not favourite)
        if (outcome !== favourite) {
            valueCount++;
        }

        // skräll (highest odd wins)
        if (outcome === skrall) {
            skrallCount++;
        }
    });

    return {
        favouriteCount,
        valueCount,
        skrallCount,
        totalMatches,

        oneCount,
        xCount,
        twoCount,

        favouriteRatio: totalMatches ? favouriteCount / totalMatches : 0,
        valueRatio: totalMatches ? valueCount / totalMatches : 0,
        skrallRatio: totalMatches ? skrallCount / totalMatches : 0,
    };
}
