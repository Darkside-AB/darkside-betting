import './SelectionButton.css';
import type { SelectionValue } from '../../types/couponDataTypes';

interface SelectionButtonProps {
  value: SelectionValue;
  valueStrength?: number | string;
  weight?: number;
  displayMode: 'grade' | 'weight';
  onChange: (nextValue: SelectionValue) => void;
}

const VALUE_MAP = [
  { color: 'rgba(0, 102, 204, 0.15)', text: '-' },
  { color: 'rgba(0, 102, 204, 0.25)', text: 'F' },
  { color: 'rgba(0, 102, 204, 0.35)', text: 'E' },
  { color: 'rgba(0, 102, 204, 0.45)', text: 'D' },
  { color: 'rgba(0, 102, 204, 0.6)', text: 'C' },
  { color: 'rgba(0, 102, 204, 0.75)', text: 'B' },
  { color: 'rgba(0, 102, 204, 1)', text: 'A' },
] as const;

const SelectionButton = ({
  value,
  valueStrength,
  weight,
  displayMode = 'grade',
  onChange,
}: SelectionButtonProps) => {
  const nextValue: SelectionValue = value === 0 ? 6 : (value - 1) as SelectionValue;
  const { color } = VALUE_MAP[value];

  const buttonText =
    displayMode === 'grade'
      ? VALUE_MAP[value].text
      : `${weight}%`;

  return (
    <button
      type="button"
      className="selectionButton"
      style={{ backgroundColor: color }}
      onClick={() => onChange(nextValue)}
    >
      {buttonText}


      {typeof valueStrength === "number" && valueStrength > 0 && (() => {
        const minSize = 8; // minimum triangle size
        const maxSize = 20; // maximum triangle size
        const size = Math.min(valueStrength * 1.5 + minSize, maxSize);
        const color = `rgba(183, 228, 199, ${Math.min(0.3 + valueStrength / 20, 1)})`;

        return (
          <span
            className="valueCorner"
            style={{
              borderTopWidth: `${size}px`,
              borderLeftWidth: `${size}px`,
              borderTopColor: color,
            }}
          >
            <span className="valueCornerText"></span>
          </span>
        );
      })()}
      {/*
      <span className="valueStrengthText">
        {typeof valueStrength === "number"
          ? `${valueStrength > 0 ? "+" : ""}${valueStrength.toFixed(2)}`
          : valueStrength}
      </span>
*/}

    </button>
  );
};

export default SelectionButton;
