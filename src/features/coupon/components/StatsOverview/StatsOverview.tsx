import React from "react";
import "./StatsOverview.css";

type StatsOverviewProps = {
    ev: string;
    mean: string;
    variance: string; // still numeric
    expectedPayoutRaw: string;
    expectedPayoutAdjusted: string;
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({
    ev,
    mean,
    variance,
    expectedPayoutRaw,
    expectedPayoutAdjusted
}) => {

    const stats = [
        {
            id: "ev",
            value: ev+' kr',
            description: "Value playing all selected rows",
        },
        {
            id: "mean",
            value: mean,
            description: "Average of correct matches per row",
        },
        {
            id: "conversion",
            value: variance, 
            description: "Result spread (variance), How spread out your possible outcomes are",
        },
        {
            id: "payoutRaw",
            value: expectedPayoutRaw+' kr',
            description: "Long-term average return for this coupon",
        },
        {
            id: "payoutAdjusted",
            value: expectedPayoutAdjusted+' kr',
            description: "Expected payout (10–13), pool share",
        },
    ];

    return (
        <div className="stats-wrapper">
            <div className="stats-container">
                {stats.map((stat) => (
                    <div key={stat.id} className="stats-card">
                        <div className="stats-value">{stat.value}</div>
                        <div className="stats-description">{stat.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
