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
import type { SelectionValue, OneXTwo, CouponRow, DrawEvent } from "./types/couponDataTypes";
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
import { calculateExpectedMoney } from "./utils/ev/calculateExpectedMoney";
import { calcPoolShareForCoupon } from "./utils/ev/calcPoolShare";
import { StatsOverview } from './components/StatsOverview/StatsOverview';
import { readJsonFile } from "./utils/fileUpload";
import { evaluateBacktest } from "./utils/backtest";
import { evaluateFavouriteProfile } from "./utils/favouriteAnalysis"


type CouponType = "europatipset" | "stryktipset";
type DisplayMode = 'grade' | 'weight' | 'both';
type DataMode = "api" | "backtest";

export default function Coupon() {
  const [dataMode, setDataMode] = React.useState<DataMode>("api");
  const [backtestData, setBacktestData] = React.useState<DrawEvent[] | null>(null);
  const [backtestResult, setBacktestResult] = React.useState<{
    hits10: number;
    hits11: number;
    hits12: number;
    hits13: number;
  } | null>(null);

  const [favouriteProfile, setFavouriteProfile] = React.useState<{
    favouriteCount: number;
    valueCount: number;
    skrallCount: number;
    totalMatches: number;

    oneCount: number;
    xCount: number;
    twoCount: number;

    favouriteRatio: number;
    valueRatio: number;
    skrallRatio: number;
  } | null>(null);

  const [reloadKey, setReloadKey] = React.useState(0);
  const [winningRow, setWinningRow] = React.useState("");
  const { couponType } = useParams<{ couponType: CouponType }>();
  const hasHydratedRef = React.useRef(false);

  const { regCloseDescription, currentNetSale, events, loading, hasEvents, error } = useCouponLogic(couponType, backtestData, reloadKey);
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

    const rows = buildReducedRows();

    if (rows.length === 0) return;

    const content = formatRowsForSvenskaSpel(rows, couponType);

    downloadTextFile(`${couponType}-rows.txt`, content);
  };
  console.log("Winning row: " + winningRow)

  const handleBacktest = () => {
    console.log("🔥 handleBacktest clicked");

    if (!winningRow) {
      console.log("❌ No winningRow");
      return;
    }

    const rows = buildReducedRows();

    if (rows.length === 0) {
      console.log("❌ No rows");
      return;
    }

    const winningArray: OneXTwo[] = winningRow
      .toUpperCase()
      .split("")
      .map(char => {
        if (char === "1") return 1;
        if (char === "X") return 2;
        if (char === "2") return 3;
        return null;
      })
      .filter((v): v is OneXTwo => v !== null);

    console.log("rows:", rows.length);
    console.log("winningArray:", winningArray);

    const result = evaluateBacktest(rows, winningArray);

    console.log("✅ Backtest result:", result);
    setBacktestResult(result);

    const favProfile = evaluateFavouriteProfile(
      winningArray,
      couponEvents
    );
    setFavouriteProfile(favProfile);
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

  const svenskaFolketByEvent = React.useMemo(() => {
    const map: Record<number, any> = {};
    couponEvents.forEach(ev => {
      if (ev.svenskaFolket) {
        map[ev.eventNumber] = ev.svenskaFolket;
      }
    });
    return map;
  }, [couponEvents]);

  const poolShare = React.useMemo(() => {
    return calcPoolShareForCoupon(
      filteredRows.length ? filteredRows : allRows,
      svenskaFolketByEvent,
      Number(currentNetSale) || 0
    );
  }, [filteredRows, allRows, svenskaFolketByEvent, currentNetSale]);


  const { mean, variance } = React.useMemo(() => {
    return calcMeanAndVariance(eventHitProbabilities);
  }, [eventHitProbabilities]);

  const hitDistribution = React.useMemo(() => {
    return calcHitDistribution10to13(eventHitProbabilities);
  }, [eventHitProbabilities]);

  console.log('hitDistribution', hitDistribution);

  const evValue = React.useMemo(() => {
    return calculateExpectedValue(
      hitDistribution,
      couponStrength
    );
  }, [hitDistribution, couponStrength]);

  const expectedMoneyRaw = React.useMemo(() => {
    return calculateExpectedMoney(
      hitDistribution,
      Number(currentNetSale),
      couponStrength
    );
  }, [hitDistribution, currentNetSale, couponStrength]);

  const expectedMoneyAdjusted = expectedMoneyRaw * poolShare;

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: "red" }}>❌ {error}</div>;
  /*
  if (!hasEvents) return <div className="api-warning">⚠️ No events available</div>;
  */

  const isBacktestReady =
    dataMode === "backtest"
      ? filteredRows.length > 0 && winningRow.length > 0
      : filteredRows.length > 0;

  console.log("test ready: " + isBacktestReady)

  const eventWeights = calculateEventWeights(reducedRows);

  Object.entries(eventWeights).forEach(([event, [w1, wX, w2]]) => {
    console.log(`${event}: ${w1}% ${wX}% ${w2}%`);
  });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile<DrawEvent[]>(file);
      setBacktestData(data);
      setDataMode("backtest");
    } catch (err) {
      alert((err as Error).message);
    }
  };

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
            onClick={dataMode === "backtest" ? handleBacktest : handleExport}
            disabled={!isBacktestReady}
          >
            {dataMode === "backtest" ? "Run backtest" : "Export rows"}
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

          <div style={{ marginBottom: "12px", fontWeight: 500 }}>
            {dataMode === "backtest" && (
              <span style={{ color: "orange" }}>Backtest mode</span>
            )}

            {dataMode === "api" && !hasEvents && (
              <span style={{ color: "red" }}>
                ⚠️ {couponType === "stryktipset" ? "Stryktipset" : "Europatipset"} has no events yet
              </span>
            )}
          </div>

          <div className="data-mode-toggle">
            <div className="mode-buttons">
              <button disabled={dataMode === "api"}
                onClick={() => {
                  setDataMode("api");
                  setBacktestData(null);      // exit backtest
                  setReloadKey(k => k + 1);   // 🔁 force reload
                }}
                className={dataMode === "api" ? "active" : ""}
              >
                📡 Live
              </button>

              <button
                onClick={() => setDataMode("backtest")}
                className={dataMode === "backtest" ? "active" : ""}
              >
                Backtest
              </button>
            </div>

            {dataMode === "backtest" && (
              <div className="backtest-controls">
                <div className="backtest-row">
                  <input type="file" accept=".json" onChange={handleFileUpload} />
                </div>

                <div className="backtest-row">
                  <input
                    type="text"
                    placeholder="Winning row (e.g. 1X21X2X1X2...)"
                    value={winningRow}
                    onChange={e => setWinningRow(e.target.value)}
                  />
                </div>

                {backtestResult && (
                  <div className="backtest-result">
                    <strong>Backtest result</strong>
                    <br />
                      <span style={{ fontSize: "11px", opacity: 0.7 }}>
                        Your result choosing selections on uploaded history round compared to the winning row
                      </span>
                    <div>13 rätt: {backtestResult.hits13}</div>
                    <div>12 rätt: {backtestResult.hits12}</div>
                    <div>11 rätt: {backtestResult.hits11}</div>
                    <div>10 rätt: {backtestResult.hits10}</div>
                    <hr style={{ margin: "12px 0" }} />
                  </div>
                )}
                {favouriteProfile && (
                  <div className="backtest-result">
                    <div style={{ marginBottom: "6px" }}>
                      <strong>Winning row:</strong> {winningRow}
                      <br />
                      <span style={{ fontSize: "11px", opacity: 0.7 }}>
                        Comparison between the winning row and the history round (favourites, value picks and skrällar)
                      </span>
                    </div>

                    <div>
                      Favourites: {favouriteProfile.favouriteCount} /{" "}
                      {favouriteProfile.totalMatches}
                    </div>
                    <div>
                      Value outcomes: {favouriteProfile.valueCount} /{" "}
                      {favouriteProfile.totalMatches}
                    </div>
                    <div>
                      Skrällar: {favouriteProfile.skrallCount} /{" "}
                      {favouriteProfile.totalMatches}
                    </div>

                    <div style={{ height: "16px" }} />

                    <div>1 outcomes: {favouriteProfile.oneCount}</div>
                    <div>X outcomes: {favouriteProfile.xCount}</div>
                    <div>2 outcomes: {favouriteProfile.twoCount}</div>

                    <div style={{ height: "16px" }} />

                    <div>
                      Favourite ratio: {(favouriteProfile.favouriteRatio * 100).toFixed(0)}%
                    </div>
                    <div>
                      Value ratio: {(favouriteProfile.valueRatio * 100).toFixed(0)}%
                    </div>
                    <div>
                      Skräll ratio: {(favouriteProfile.skrallRatio * 100).toFixed(0)}%
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>


          <div style={{ padding: "24px" }}>
            <StatsOverview
              ev={evValue.ev.toFixed(0)}
              mean={mean.toFixed(2)}
              variance={variance.toFixed(2)}
              expectedPayoutRaw={expectedMoneyRaw.toFixed(0)}
              expectedPayoutAdjusted={expectedMoneyAdjusted.toFixed(0)}
            />
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
