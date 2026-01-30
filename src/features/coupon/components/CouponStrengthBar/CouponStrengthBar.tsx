import React from "react";
import "./CouponStrengthBar.css";

type Props = {
  couponStrength: number;
};

function normalizeStrength(strength: number): number {
  const min = 0;    // minimum expected strength
  const max = 6;   // adjust this to your max realistic value
  const capped = Math.min(Math.max(strength, min), max);
  return ((capped - min) / (max - min)) * 100;
}

function getLabel(strength: number) {
  if (strength < 1.01) return "Nothing";
  if (strength < 1.5) return "Low reward";
  if (strength < 2.8) return "Balanced";
  if (strength < 5.5) return "High reward";
  return "Extreme";
}

function getColorClass(strength: number) {
  if (strength < 1.5) return "low";
  if (strength < 2.8) return "balanced";
  if (strength < 5.5) return "high";
  return "extreme";
}

export const CouponStrengthBar: React.FC<Props> = ({
  couponStrength
}) => {
  const percent = normalizeStrength(couponStrength);
  const label = getLabel(couponStrength);
  const colorClass = getColorClass(couponStrength);

  return (
    <div className="coupon-strength">
      <div className="coupon-strength__title">
        Coupon strength against swedish people
      </div>

      <div className="coupon-strength__bar">
        <div
          className={`coupon-strength__fill ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="coupon-strength__label">
        {label}
        <span className="coupon-strength__value">
          ({couponStrength.toFixed(2)}×)
        </span>
      </div>
    </div>
  );
};
