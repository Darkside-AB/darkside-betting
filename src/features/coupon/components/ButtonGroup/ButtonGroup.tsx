import React from 'react';
import './ButtonGroup.css';
import SelectionButton from '../SelectionButton/SelectionButton';
import type { SelectionValue } from '../SelectionButton/SelectionButton';

interface ButtonGroupProps {
  eventNumber: number;
  isValueBet1: boolean;
  isValueBetX: boolean;
  isValueBet2: boolean;
  onChange: (eventNumber: number, playableCount: number) => void;
}

const ButtonGroup = ({
  eventNumber,
  isValueBet1,
  isValueBetX,
  isValueBet2,
  onChange,
}: ButtonGroupProps) => {
  // Grouped state: [home, draw, away]
  const [values, setValues] = React.useState<[SelectionValue, SelectionValue, SelectionValue]>([0, 0, 0]);

  const [home, draw, away] = values;

  const playableCount = React.useMemo(
    () => values.filter(v => v > 0).length,
    [values]
  );

  React.useEffect(() => {
    onChange(eventNumber, playableCount);
  }, [eventNumber, playableCount]);

  const updateValue = (
    index: 0 | 1 | 2,
    value: SelectionValue
  ) => {
    setValues(prev => {
      const next = [...prev] as typeof prev;
      next[index] = value;
      return next;
    });
  };

  const weights = React.useMemo(() => {
  const total = values.reduce<number>((sum, v) => sum + v, 0);
  if (total === 0) return [0, 0, 0];

  return values.map(v => Math.round((v / total) * 100));
}, [values]);

  return (
  <div className="buttonGroup">
    <div className="buttonColumn">
      <SelectionButton
        value={home}
        isValueBet={isValueBet1}
        onChange={v => updateValue(0, v)}
      />
      <div className="weight">{values[0] > 0 ? Math.round((values[0] / values.reduce((a, b) => a + b, 0)) * 100) : ''}</div>
    </div>

    <div className="buttonColumn">
      <SelectionButton
        value={draw}
        isValueBet={isValueBetX}
        onChange={v => updateValue(1, v)}
      />
      <div className="weight">{values[1] > 0 ? Math.round((values[1] / values.reduce((a, b) => a + b, 0)) * 100) : ''}</div>
    </div>

    <div className="buttonColumn">
      <SelectionButton
        value={away}
        isValueBet={isValueBet2}
        onChange={v => updateValue(2, v)}
      />
      <div className="weight">{values[2] > 0 ? Math.round((values[2] / values.reduce((a, b) => a + b, 0)) * 100) : ''}</div>
    </div>
  </div>
);


};

export default ButtonGroup;
