import React from "react";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper";
import ButtonGroup from "./components/ButtonGroup/ButtonGroup";
import "../../../index.css";

type CouponType = "europatipset" | "stryktipset";

export default function Coupon() {
  const { couponType } = useParams<{ couponType: CouponType }>();

  const { events, loading, hasEvents, error } = useCouponLogic(couponType);

  const [selections, setSelections] = React.useState<Record<number, number>>({});

  const handleSelectionChange = React.useCallback(
  (eventNumber: number, playableCount: number) => {
    setSelections(prev => ({
      ...prev,
      [eventNumber]: playableCount,
    }));
  },
  []
);


  if (loading) return <Spinner />;
  if (error) {
    return <div style={{ color: "red" }}>❌ {error}</div>;
  }

  if (!hasEvents) {
    return (
      <div className="api-warning">
        ⚠️ API connected – no events available yet
      </div>
    );
  }

  const couponEvents = mapDrawEventsToCouponEvents(events);

  return (
    <section className="tip-card">
      {couponEvents.map(event => (
        <div key={event.eventNumber} className="grid-row">
          <div className="match-info">
            <strong>
              {event.eventNumber}. {event.description}
            </strong>
            <p className="stat-text">
              Price: {event.odds?.one} / {event.odds?.x} / {event.odds?.two}
            </p>
            <p className="stat-text">
              People: {event.svenskaFolket?.one}% /{" "}
              {event.svenskaFolket?.x}% / {event.svenskaFolket?.two}%
            </p>
          </div>
          
          <ButtonGroup
            eventNumber={event.eventNumber}
            isValueBet1={true}
            isValueBetX={false}
            isValueBet2={true}
            onChange={handleSelectionChange}
          />
          
        </div>
      ))}
    </section>
  );
}