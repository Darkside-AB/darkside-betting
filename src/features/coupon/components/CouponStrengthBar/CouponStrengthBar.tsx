import React from "react";
import "./CouponStrengthBar.css";

type Props = {
  couponStrength: number;
};

function normalizeStrength(strength: number): number {
  const min = 0;    // minimum expected strength
  const max = 50;   // adjust this to your max realistic value
  const capped = Math.min(Math.max(strength, min), max);
  return ((capped - min) / (max - min)) * 100;
}

function getLabel(strength: number) {
  if (strength < 1) return "Low reward";
  if (strength < 10) return "Balanced";
  if (strength < 20) return "High reward";
  return "Extreme";
}

function getColorClass(strength: number) {
  if (strength < 1) return "low";
  if (strength < 10) return "balanced";
  if (strength < 20) return "high";
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
        Reward potential
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
