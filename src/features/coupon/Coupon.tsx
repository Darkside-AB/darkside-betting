import React from "react";
import "../../../index.css";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper";
import ButtonGroup from "./components/ButtonGroup/ButtonGroup";
import EventWeightsModal from "./components/EventWeightsModal/EventWeightsModal";
import { cartesian, buildRowsFromSelections } from "./utils/couponMath";
import { formatRowsForSvenskaSpel } from "./utils/svenskaSpelFormatter";
import { downloadTextFile } from "./utils/fileDownload";
import { getValueStrengths } from "./utils/couponMath";
import { reduceRowsEvenDistribution } from "./utils/reduceRowsEvenDistribution";
import { calculateEventWeights } from "./utils/calculateEventWeights";
import type { SelectionValue, OneXTwo, CouponRow } from "./types/couponDataTypes";
import { calculateWeightsByEvent } from "./utils/calculateWeightsByEvent";
import { deriveSelections } from "./utils/deriveSelections";
import type { CouponStorage } from "./types/couponStorage";
import {
  loadCouponState,
  saveCouponState,
} from "./utils/couponStorage";

type CouponType = "europatipset" | "stryktipset";

export default function Coupon() {
  const { couponType } = useParams<{ couponType: CouponType }>();
  const { regCloseDescription, currentNetSale, events, loading, hasEvents, error } = useCouponLogic(couponType);
  const [showWeights, setShowWeights] = React.useState(false);
  const [reducedRows, setReducedRows] = React.useState<OneXTwo[][]>([]);
  const [maxRows, setMaxRows] = React.useState(0);

 

  if (!couponType) {
    return <div style={{ color: "red" }}>Invalid coupon type</div>;
  }

 const hasHydratedRef = React.useRef(false);

const [valuesByEvent, setValuesByEvent] = React.useState<
  Record<number, [SelectionValue, SelectionValue, SelectionValue]>
>(() => loadCouponState(couponType)?.valuesByEvent ?? {});

// 🔁 Reload when coupon changes
React.useEffect(() => {
  const stored = loadCouponState(couponType);
  setValuesByEvent(stored?.valuesByEvent ?? {});
  hasHydratedRef.current = false;
}, [couponType]);

// 💾 Save after hydration
React.useEffect(() => {
  if (!hasHydratedRef.current) {
    hasHydratedRef.current = true;
    return;
  }

  saveCouponState(couponType, { valuesByEvent });
}, [couponType, valuesByEvent]);




  const weightsByEvent = React.useMemo(
    () => calculateWeightsByEvent(valuesByEvent),
    [valuesByEvent]
  );


  const handleButtonGroupChange = React.useCallback(
    (
      eventNumber: number,
      values: [SelectionValue, SelectionValue, SelectionValue]
    ) => {
      setValuesByEvent(prev => ({
        ...prev,
        [eventNumber]: values,
      }));
    },
    []
  );


  const selections = React.useMemo(() => {
    return deriveSelections(valuesByEvent);
  }, [valuesByEvent]);

  const baseRows: CouponRow[] = React.useMemo(() => {
    return buildRowsFromSelections(selections);
  }, [selections]);


  const allRows: CouponRow[] = React.useMemo(() => {
    if (baseRows.length === 0) return [];
    return cartesian(baseRows);
  }, [baseRows]);

  React.useEffect(() => {
    setReducedRows([]);
  }, [allRows, valuesByEvent, maxRows]);


  const buildReducedRows = React.useCallback(() => {
    if (allRows.length === 0) return [];

    const rows = reduceRowsEvenDistribution(
      allRows,
      weightsByEvent,
      maxRows
    );

    setReducedRows(rows);
    return rows;
  }, [allRows, weightsByEvent, maxRows]);

  const handleOpenWeights = () => {
    if (reducedRows.length === 0) {
      buildReducedRows();
    }
    setShowWeights(true);
  };


  const handleExport = () => {
    const rows =
      reducedRows.length > 0 ? reducedRows : buildReducedRows();

    if (rows.length === 0) return;

    const content = formatRowsForSvenskaSpel(rows, couponType);

    downloadTextFile(`${couponType}-rows.txt`, content);
  };


  if (loading) return <Spinner />;
  if (error) return <div style={{ color: "red" }}>❌ {error}</div>;
  if (!hasEvents) return <div className="api-warning">⚠️ No events available</div>;

  const couponEvents = mapDrawEventsToCouponEvents(events);

  const eventWeights = calculateEventWeights(reducedRows);



  Object.entries(eventWeights).forEach(([event, [w1, wX, w2]]) => {
    console.log(`${event}: ${w1}% ${wX}% ${w2}%`);
  });


  return (
    <>
      <section className="tip-card">
        <div className="coupon-summary">
          <div className="summary-item">
            <span className="label">Total rows</span>
            <span className="value">{allRows.length}</span>
          </div>

          <div className="summary-item">
            <span className="label">Playing rows</span>
            <input
              type="number"
              min={1}
              max={allRows.length || 1}
              value={maxRows || ""}
              onChange={e => {
                const val = e.target.value;
                // Allow empty string while typing
                if (val === "") {
                  setMaxRows(0); // shows empty
                  return;
                }
                setMaxRows(Number(val));
              }}
              onBlur={e => {
                // Clamp on blur
                const val = Number(e.target.value) || 1;
                setMaxRows(Math.min(Math.max(val, 1), allRows.length || 1));
              }}
              className="max-rows-inline"
            />
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
            onClick={handleOpenWeights}
            disabled={allRows.length === 0}
          >
            View system weights
          </button>


          <button
            onClick={handleExport}
            disabled={allRows.length === 0}
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
                initialValues={valuesByEvent[event.eventNumber]}
                valueStrength1={valueStrengths[0]}
                valueStrengthX={valueStrengths[1]}
                valueStrength2={valueStrengths[2]}
                onChange={handleButtonGroupChange}
              />
            </div>
          );
        })}

      </section>
      <EventWeightsModal
        isOpen={showWeights}
        onClose={() => setShowWeights(false)}
        weightsByEvent={calculateEventWeights(reducedRows)}
      />
    </>
  );
}
