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
import { getValueStrengths } from "./utils/couponMath";
import { reduceRowsByWeight } from "./utils/reduceRows";
import type { OneXTwo, CouponRow } from "./types";
import type { ButtonGroupChange } from "./components/ButtonGroup/ButtonGroup";

type CouponType = "europatipset" | "stryktipset";

export default function Coupon() {
  const { couponType } = useParams<{ couponType: CouponType }>();
  const { regCloseDescription, currentNetSale, events, loading, hasEvents, error } = useCouponLogic(couponType);

  const [selections, setSelections] = React.useState<
    Record<number, OneXTwo[]>
  >({});

  const [weightsByEvent, setWeightsByEvent] = React.useState<
    Record<number, [number, number, number]>
  >({});

  const [maxRows, setMaxRows] = React.useState(0);

  const handleSelectionChange = React.useCallback(
    (eventNumber: number, data: ButtonGroupChange) => {
      setSelections(prev => ({
        ...prev,
        [eventNumber]: data.selections,
      }));

      setWeightsByEvent(prev => ({
        ...prev,
        [eventNumber]: data.weights,
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

  const reducedRows = React.useMemo(() => {
    if (!allRows.length) return [];

    return reduceRowsByWeight(
      allRows,
      weightsByEvent,
      maxRows
    );
  }, [allRows, weightsByEvent, maxRows]);


  React.useEffect(() => {
    console.log("All rows:", allRows.length);
    console.log("Reduced rows:", reducedRows.length);
    console.log("Top 5 rows:", reducedRows.slice(0, 5));
  }, [allRows, reducedRows]);

  const handleExport = () => {
    if (reducedRows.length === 0) return;

    const content = formatRowsForSvenskaSpel(
      reducedRows,
      couponType
    );

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
          <span className="label">Playing rows</span>
          <span className="value">{reducedRows.length}</span>
        </div>

        <div className="summary-item summary-slider">
          <span className="label">System size</span>

          <input
            type="range"
            min={1}
            max={allRows.length || 1}
            step={1}
            value={maxRows}
            onChange={e => setMaxRows(Number(e.target.value))}
          />
        </div>

        <div className="summary-item summary-item--compact">
          <div className="summary-item__value summary-item__value--muted">
            {couponType === "stryktipset" ? "Stryktipset " : "Europatipset"}
          </div>
          <div className="summary-item__value summary-item__value--muted">
            {regCloseDescription?.split(",")[1]?.trim().split(" ").slice(1).join(" ") ?? ""}
          </div>
          <div className="summary-item__value summary-item__value--muted">
            Omsättning: {currentNetSale}
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={reducedRows.length === 0}
        >
          Export rows
        </button>

      </div>


      {couponEvents.map(event => {
        // --- Step 1: compute valueStrengths for this event ---
        const valueStrengths = event.odds
          ? getValueStrengths(event.odds, event.svenskaFolket)
          : ["X", "X", "X"]; // fallback if odds are missing

        // --- Step 2: return JSX using calculated strengths ---
        return (
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
              valueStrength1={valueStrengths[0]}
              valueStrengthX={valueStrengths[1]}
              valueStrength2={valueStrengths[2]}
              onChange={handleSelectionChange}
            />
          </div>
        );
      })}

    </section>
  );
}
