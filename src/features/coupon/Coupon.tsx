import Spinner from "../../components/Spinner";
import { useCouponLogic } from "./hooks/useCouponLogic";
import { mapDrawEventsToCouponEvents } from "./utils/couponMapper"

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
    <div>
      {/* Connection status ok */}
      <p style={{ color: "green" }}>
        ✅ API connected – events available 🦫+🐹
      </p>
      {/* Events */}
    {couponEvents.map(event => (
      <div key={event.eventNumber}>
        <h4>{event.eventNumber}. {event.description}</h4>
        {event.odds ? (
          <div>
            Odds: {event.odds.one+ " "}
            {event.odds.x+ " "}
            {event.odds.two+ " "}
          </div>
        ) : (
          <p>Odds not available</p>
        )}

        {event.svenskaFolket ? (
          <div>
            Folket: {event.svenskaFolket.one+ "% "}
            {event.svenskaFolket.x+ "% "}
            {event.svenskaFolket.two+ "% "}
          </div>
        ) : (
          <p>People not available</p>
        )}
      </div>
    ))}
  </div>

  );
}
