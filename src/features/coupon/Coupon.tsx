import React from "react";
import "../../../index.css";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper";
import ButtonGroup from "./components/ButtonGroup/ButtonGroup";
import { cartesian, buildRowsFromSelections } from "./utils/couponMath";
import { formatRowsForSvenskaSpel } from "./utils/svenskaSpelFormatter";
import { downloadTextFile } from "./utils/fileDownload";
import type { OneXTwo, CouponRow } from "./types";

type CouponType = "europatipset" | "stryktipset";

export default function Coupon() {
  const { couponType } = useParams<{ couponType: CouponType }>();
  const { events, loading, hasEvents, error } = useCouponLogic(couponType);

  const [selections, setSelections] = React.useState<
    Record<number, OneXTwo[]>
  >({});

  const handleSelectionChange = React.useCallback(
    (eventNumber: number, selectionsForEvent: OneXTwo[]) => {
      setSelections(prev => ({
        ...prev,
        [eventNumber]: selectionsForEvent,
      }));
    },
    []
  );

  const baseRows: CouponRow[] = React.useMemo(() => {
    return buildRowsFromSelections(selections);
  }, [selections]);

  const allRows: CouponRow[] = React.useMemo(() => {
    if (baseRows.length === 0) return [];
    return cartesian(baseRows);
  }, [baseRows]);

  if (!couponType) {
    return <div style={{ color: "red" }}>Invalid coupon type</div>;
  }

  const handleExport = () => {
    if (allRows.length === 0) return;

    const content = formatRowsForSvenskaSpel(allRows, couponType);

    downloadTextFile(
      `${couponType}-rows.txt`,
      content
    );
  };

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: "red" }}>❌ {error}</div>;
  if (!hasEvents) return <div className="api-warning">⚠️ No events available</div>;

  const couponEvents = mapDrawEventsToCouponEvents(events);

  return (
    <section className="tip-card">
      <div className="coupon-summary">
        <div className="summary-item">
          <span className="label">Total rows</span>
          <span className="value">{allRows.length}</span>
        </div>

        <div className="summary-item">
          <span className="label">System</span>
          <span className="value">
            {couponType === "stryktipset" ? "Stryktipset" : "Europatipset"}
          </span>
        </div>
        <button
          onClick={handleExport}
          disabled={allRows.length === 0}
        >
          Export rows
        </button>

      </div>


      {couponEvents.map(event => (
        <div key={event.eventNumber} className="grid-row">
          <div className="match-info">
            <strong>{event.eventNumber}. {event.description}</strong>
             <p className="stat-text">
              Odds: {event.odds?.one} / {event.odds?.x} / {event.odds?.two}
            </p>
            <p className="stat-text">
              Sv Folket: {event.svenskaFolket?.one}% /{" "}
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
