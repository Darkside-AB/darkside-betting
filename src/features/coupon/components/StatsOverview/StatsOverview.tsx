import React from "react";
import "./StatsOverview.css";

type StatsOverviewProps = {
  ev: string;
  mean: string;
  variance: string;
  expectedPayoutRaw: string;
  expectedPayoutAdjusted: string;
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  ev,
  mean,
  variance,
  expectedPayoutRaw,
  expectedPayoutAdjusted,
}) => {
  const stats = [
    {
      id: "ev",
      value: ev + " kr",
      description: "Estimated value if all rows are played",
      tooltip: "Theoretical value based on odds and crowd distribution",
    },
    {
      id: "mean",
      value: mean,
      description: "Average number of correct matches per row",
      tooltip: "How many correct picks you get per row on average",
    },
    {
      id: "variance",
      value: variance,
      description: "How much the results can vary (spread)",
      tooltip: "Higher = bigger swings between bad and good outcomes",
    },
    {
      id: "payoutRaw",
      value: expectedPayoutRaw + " kr",
      description: "Estimated return over many similar plays",
      tooltip: "Long-term expected payout across all outcomes",
    },
    {
      id: "payoutAdjusted",
      value: expectedPayoutAdjusted + " kr",
      description: "Average payout when you reach 10–13 hits (long-term)",
      tooltip: "Expected payout only when reaching prize levels (10–13 hits)",
    },
  ];

  return (
    <div className="stats-wrapper">
      <div className="stats-container">
        {stats.map((stat) => (
            
          <div key={stat.id} className="stats-card">
            <span className="stats-tooltip">{stat.tooltip}</span>
            <div className="stats-value">{stat.value}</div>

            <div className="stats-description">
              {stat.description}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
