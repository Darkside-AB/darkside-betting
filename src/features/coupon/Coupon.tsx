import Spinner from "../../components/Spinner";
import { useCouponLogic } from "./hooks/useCouponLogic";

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


  return (
    <div>
      <p style={{ color: "green" }}>
        ✅ API connected – events available
      </p>

      <p>Number of events: {events.length}</p>

      <pre>{JSON.stringify(events[0], null, 2)}</pre>
    </div>
  );
}
