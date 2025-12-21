import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper"
import "../../../index.css";

type CouponType = "europatipset" | "stryktipset";

export default function Coupon() {
  const { couponType } = useParams<{ couponType: CouponType }>();

  console.log("couponType:", couponType);

  const {
    events,
    loading,
    hasEvents,
    error,
  } = useCouponLogic(couponType);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={{ color: "red" }}>
        ❌ {error} {couponType}
      </div>
    );
  }

  if (!hasEvents) {
    return (
      <div className="api-warning">
        ⚠️ API connected – no events available yet
        <p>
          {couponType?.toUpperCase()} -
          Betting events are usually published closer to match day.
          Please check back later.
        </p>
      </div>

    );
  }

  const couponEvents = mapDrawEventsToCouponEvents(events);

  return (
    <section className="tip-card">
      <p className="text-muted">
        ✅ API connected – events available from - {couponType?.toUpperCase()}
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
            <p className="stat-text">People: {event.svenskaFolket?.one}% / {event.svenskaFolket?.x}% / {event.svenskaFolket?.two}%</p>
          </div>
          <input type="number" />
          <input type="number" />
          <input type="number" />
        </div>
      ))}
    </section>


  );
};

