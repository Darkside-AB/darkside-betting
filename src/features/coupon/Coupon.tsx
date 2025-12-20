import Spinner from "../../components/Spinner";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper"
import "../../../index.css";

export default function Coupon() {
  const {
    events,
    loading,
    hasEvents,
    error,
  } = useCouponLogic();

  if (loading) return <Spinner />;

  if (error) {
    return (
      <p style={{ color: "red" }}>
        ❌ {error}
      </p>
    );
  }

  if (!hasEvents) {
    return (
      <p style={{ color: "orange" }}>
        ⚠️ API connected – no events available yet
        <p>
          Betting events are usually published closer to match day.
          Please check back later.
        </p>
      </p>

    );
  }

  const couponEvents = mapDrawEventsToCouponEvents(events);

  return (
    <section className="tip-card">
      <p className="text-muted">
      ✅ API connected – events available
      </p>

      {/* Grid Header */}
      <div className="grid-header">
        <span></span>
        <span>1</span>
        <span>X</span>
        <span>2</span>
      </div>

      {/* Grid Rows */}
      {couponEvents.map(event => (
        <div key={event.eventNumber} className="grid-row">
          <div className="match-info">
            <strong>{event.eventNumber}. {event.description}</strong>
            <p className="stat-text">Price: {event.odds?.one} / {event.odds?.one} / {event.odds?.two}</p>
            <p className="stat-text">People: {event.svenskaFolket?.one}%/ {event.svenskaFolket?.x}%/ {event.svenskaFolket?.two}%</p>
          </div>
          <input type="number"  />
          <input type="number"  />
          <input type="number"  />
        </div>
      ))}
    </section>


  );
};

