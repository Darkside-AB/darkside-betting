import './SelectionButton.css';
import type { SelectionValue } from '../../types/couponDataTypes';

interface SelectionButtonProps {
  value: SelectionValue;
  valueStrength?: number | string;
  onChange: (nextValue: SelectionValue) => void;
}

const VALUE_MAP = [
  { color: 'rgba(0, 102, 204, 0.15)', text: '-' },
  { color: 'rgba(0, 102, 204, 0.25)', text: 'F' },
  { color: 'rgba(0, 102, 204, 0.35)', text: 'E' },
  { color: 'rgba(0, 102, 204, 0.45)', text: 'D' },
  { color: 'rgba(0, 102, 204, 0.6)',  text: 'C' },
  { color: 'rgba(0, 102, 204, 0.75)', text: 'B' },
  { color: 'rgba(0, 102, 204, 1)',    text: 'A' },
] as const;

const SelectionButton = ({
  value,
  valueStrength,
  onChange,
}: SelectionButtonProps) => {
  const nextValue: SelectionValue = value === 0 ? 6 : (value - 1) as SelectionValue;
  const { color, text } = VALUE_MAP[value];

  return (
    <button
      type="button"
      className="selectionButton"
      style={{ backgroundColor: color }}
      onClick={() => onChange(nextValue)}
    >
      {text}

      
    {typeof valueStrength === "number" && valueStrength > 0 && (
  <span className="valueCorner">
    <span className="valueCornerText"></span>
  </span>
)}

      <span className="valueStrengthText">
        {typeof valueStrength === "number"
          ? `${valueStrength > 0 ? "+" : ""}${valueStrength.toFixed(2)}`
          : valueStrength}
      </span>
    </button>
  );
};

export default SelectionButton;
