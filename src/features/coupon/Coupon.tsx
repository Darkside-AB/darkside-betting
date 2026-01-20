import React from "react";
import "../../../index.css";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper";
import ButtonGroup from "./components/ButtonGroup/ButtonGroup";
import SignDistributionFilter from "./components/SignDistributionFilter/SignDistributionFilter";
import EventWeightsModal from "./components/EventWeightsModal/EventWeightsModal";
import { cartesian, buildRowsFromSelections, getNumericValueStrengths, getValueStrengths } from "./utils/couponMath";
import { matchesSignRanges } from "./filters/signDistribution";
import { formatRowsForSvenskaSpel } from "./utils/svenskaSpelFormatter";
import { downloadTextFile } from "./utils/fileDownload";
import { reduceRowsEvenDistribution } from "./utils/reduceRowsEvenDistribution";
import { calculateEventWeights } from "./utils/calculateEventWeights";
import type { SelectionValue, OneXTwo, CouponRow } from "./types/couponDataTypes";
import { calculateWeightsByEvent } from "./utils/calculateWeightsByEvent";
import { deriveSelections } from "./utils/deriveSelections";
import { calculateCouponStrengthFromEvents } from "./utils/couponStrength";
import {
  loadCouponState,
  saveCouponState,
  clearCouponState
} from "./utils/couponStorage";
import { CouponStrengthBar } from "./components/CouponStrengthBar/CouponStrengthBar";
import { calcNormalizedSignProbs } from "./utils/ev/probabilities";
import { normalizeWeights } from "./utils/ev/weights";
import { calcEventHitProbability } from "./utils/ev/eventHitProbability";
import { calcMeanAndVariance } from "./utils/ev/distribution";
import { calcHitDistribution10to13 } from "./utils/ev/calcHitDistribution10to13";
import { calculateExpectedValue } from "./utils/ev/calculateExpectedValue";



type CouponType = "europatipset" | "stryktipset";
type DisplayMode = 'grade' | 'weight' | 'both';

export default function Coupon() {
  const { couponType } = useParams<{ couponType: CouponType }>();
  const hasHydratedRef = React.useRef(false);

  const { regCloseDescription, currentNetSale, events, loading, hasEvents, error } = useCouponLogic(couponType);
  const [showWeights, setShowWeights] = React.useState(false);
  const [reducedRows, setReducedRows] = React.useState<OneXTwo[][]>([]);
  const [maxRows, setMaxRows] = React.useState(0);
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('grade');
  const [signRanges, setSignRanges] = React.useState<Record<"1" | "X" | "2", [number, number]>>({
    "1": [0, 13],
    "X": [0, 13],
    "2": [0, 13],
  });
  const [resetKey, setResetKey] = React.useState(0);


  if (!couponType) {
    return <div style={{ color: "red" }}>Invalid coupon type</div>;
  }

  const handleClearCoupon = () => {
    clearCouponState(couponType);

    setValuesByEvent({});
    setReducedRows([]);
    setMaxRows(0);

    // force full reset of all ButtonGroup components
    setResetKey(k => k + 1);
  };




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

  const filteredRows = React.useMemo(() => {
    return allRows.filter(row =>
      matchesSignRanges(row, signRanges)
    );
  }, [allRows, signRanges]);


  React.useEffect(() => {
    setReducedRows([]);
  }, [filteredRows, valuesByEvent, maxRows]);


  const buildReducedRows = React.useCallback(() => {
    if (filteredRows.length === 0) return [];


    const rows = reduceRowsEvenDistribution(
      filteredRows,
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
  const couponEvents = mapDrawEventsToCouponEvents(events);
  const couponStrength = React.useMemo(() => {
    return calculateCouponStrengthFromEvents(
      couponEvents,
      weightsByEvent,
      getNumericValueStrengths
    );
  }, [couponEvents, weightsByEvent]);

  const eventHitProbabilities = React.useMemo(() => {
    return couponEvents.map(event => {
      const valueStrengths = getNumericValueStrengths(
        event.odds,
        event.svenskaFolket
      );

      const signProbs = calcNormalizedSignProbs(
        valueStrengths,
        event.svenskaFolket
      );

      const weights = weightsByEvent[event.eventNumber] ?? [0, 0, 0];
      const normalizedWeights = normalizeWeights(weights);

      return calcEventHitProbability(signProbs, normalizedWeights);
    });
  }, [couponEvents, weightsByEvent]);

  const { mean, variance } = React.useMemo(() => {
    return calcMeanAndVariance(eventHitProbabilities);
  }, [eventHitProbabilities]);

  const hitDistribution = React.useMemo(() => {
    return calcHitDistribution10to13(eventHitProbabilities);
  }, [eventHitProbabilities]);

  console.log('hitDistribution', hitDistribution);

  const p13Display = React.useMemo(() => {
    const p13 = hitDistribution[13];

    if (!p13 || p13 <= 0) return "≈ 0";

    return `1 in ${Math.round(1 / p13).toLocaleString()}`;
  }, [hitDistribution]);

  const evResult = React.useMemo(() => {
    return calculateExpectedValue(
      hitDistribution,
      couponStrength
    );
  }, [hitDistribution, couponStrength]);


  if (loading) return <Spinner />;
  if (error) return <div style={{ color: "red" }}>❌ {error}</div>;
  if (!hasEvents) return <div className="api-warning">⚠️ No events available</div>;



  const eventWeights = calculateEventWeights(reducedRows);

  Object.entries(eventWeights).forEach(([event, [w1, wX, w2]]) => {
    console.log(`${event}: ${w1}% ${wX}% ${w2}%`);
  });


  return (
    <>
      <section className="tip-card">
        {/* ================= SUMMARY ================= */}
        <div className="coupon-summary">
          <div className="summary-item">
            <span className="label">Total rows</span>
            <span className="value">{allRows.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">After Filter</span>
            <span className="value">{filteredRows.length}</span>
          </div>

          <div className="summary-item">
            <span className="label">Playing rows</span>
            <input
              type="number"
              min={1}
              max={filteredRows.length || 1}
              value={maxRows || ""}
              onChange={e => {
                const val = e.target.value;
                if (val === "") {
                  setMaxRows(0);
                  return;
                }
                setMaxRows(Number(val));
              }}
              onBlur={e => {
                const val = Number(e.target.value) || 1;
                setMaxRows(Math.min(Math.max(val, 1), filteredRows.length || 1));
              }}
              className="max-rows-inline"
            />
          </div>

          <div className="summary-item summary-slider">
            <span className="label">System size</span>
            <input
              type="range"
              min={1}
              max={filteredRows.length || 1}
              step={1}
              value={maxRows}
              onChange={e => setMaxRows(Number(e.target.value))}
            />
          </div>
          <SignDistributionFilter
            ranges={signRanges}
            onChange={setSignRanges}
          />
          <button
            onClick={handleOpenWeights}
            disabled={filteredRows.length === 0}
          >
            Show weights
          </button>

          <button
            onClick={handleExport}
            disabled={filteredRows.length === 0}
          >
            Export rows
          </button>
        </div>

        {/* ⬇️ INFO BLOCK LAST */}
        <div className="summary-item summary-item--compact">
          <div className="summary-item__value summary-item__value--muted">
            {couponType === "stryktipset" ? "Stryktipset" : "Europatipset"}
          </div>
          <div className="summary-item__value summary-item__value--muted">
            {regCloseDescription?.split(",")[1]
              ?.trim()
              .split(" ")
              .slice(1)
              .join(" ") ?? ""}
          </div>
          <div className="summary-item__value summary-item__value--muted">
            Omsättning: {currentNetSale} SvKr
          </div>
          <div className="summary-item__value summary-item__value--muted">
            <CouponStrengthBar couponStrength={couponStrength} />
          </div>

          <div className="summary-item">
            {/* ===== EXPECTED VALUE (PRIMARY DECISION METRIC) ===== */}
            <div className={`ev-primary ev-${evResult.classification}`}>
              <span className="ev-score">
                {evResult.ev.toFixed(2)}
              </span>
              <span className="ev-label"> Expected Value, Stefans return, to be continued!!</span>
              <span className="metric-help">
                Long-term expected return compared to an average coupon
              </span>
            </div>

            {/* ===== SUPPORTING METRICS ===== */}
            <span className="label">Expected correct signs</span>

            <div className="summary-metric">
              <span className="value">{mean.toFixed(2)}</span>
              <span className="metric-help">
                Average number of correct matches per row
              </span>
            </div>

            <div className="summary-metric">
              <span className="value">{variance.toFixed(2)}</span>
              <span className="metric-help">
                Result volatility — higher means bigger payout potential:
                {" Variance ~1.5 → safe ~2.0–2.5 → balanced >2.5 → aggressive"}
              </span>
            </div>

            <div className="summary-metric">
              <span className="label">Chance to hit 13 with one row</span>
              <span className="metric-help">{p13Display} rows</span>
            </div>
          </div>
          <div className="summary-item">
  <span className="label">Hit distribution (10–13)</span>
  <div className="summary-metric">
    {Object.entries(hitDistribution).map(([k, v]) => (
      <div key={k}>
        <span className="value">{k}:</span>{" "}
        <span className="metric-help">{v.toExponential(2)}</span>
      </div>
    ))}
  </div>
</div>




        </div>

        {/* ================= DISPLAY TOGGLE ================= */}
        <div className="coupon-display-toggle-container">
          {/* Keep buttons inline */}
          <div className="coupon-display-toggle">
            <button
              className={displayMode === 'grade' ? 'active' : ''}
              onClick={() => setDisplayMode('grade')}
            >
              A–F
            </button>
            <button
              className={displayMode === 'weight' ? 'active' : ''}
              onClick={() => setDisplayMode('weight')}
            >
              %
            </button>
          </div>

          {/* Legend separate below */}
          <div className="triangle-legend">
            <span className="legend-triangle"></span>
            <span className="legend-text">Value bet</span>
          </div>
        </div>



        {/* ================= GRID ROWS ================= */}
        {couponEvents.map(event => {
          const valueStrengths = event.odds
            ? getValueStrengths(event.odds, event.svenskaFolket)
            : ["X", "X", "X"];

          return (
            <div
              key={`${event.eventNumber}-${resetKey}`}
              className="grid-row"
            >
              <div className="match-info">
                <strong>
                  {event.eventNumber}. {event.description}
                </strong>
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
                displayMode={displayMode}
                onChange={handleButtonGroupChange}
              />
            </div>
          );
        })}
        {/* ================= CLEAR COUPON ================= */}
        <div className="coupon-clear-container">
          <button
            className="coupon-clear-button"
            onClick={handleClearCoupon}
          >
            Clear coupon
          </button>
        </div>
      </section>

      <EventWeightsModal
        isOpen={showWeights}
        onClose={() => setShowWeights(false)}
        weightsByEvent={calculateEventWeights(reducedRows)}
      />
    </>
  );

}
