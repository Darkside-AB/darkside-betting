import './SelectionButton.css';

export type SelectionValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface SelectionButtonProps {
  value: SelectionValue;
  isValueBet: boolean;
  onChange: (nextValue: SelectionValue) => void;
}

const VALUE_MAP = [
  { color: 'grey', text: '-' },
  { color: '#990000', text: 'F' },
  { color: '#ff8c5a', text: 'E' },
  { color: '#ffb234', text: 'D' },
  { color: '#ffd934', text: 'C' },
  { color: '#add633', text: 'B' },
  { color: 'green', text: 'A' },
] as const;

const SelectionButton = ({
  value,
  isValueBet,
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
      <span
        className="valueBetIndicator"
        style={{
          backgroundColor: isValueBet ? 'rgb(35, 211, 250)' : color,
        }}
      />
      {text}
    </button>
  );
};

export default SelectionButton;
