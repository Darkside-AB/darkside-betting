import React from "react";
import "./ButtonGroup.css";
import SelectionButton from "../SelectionButton/SelectionButton";
import type { SelectionValue } from "../SelectionButton/SelectionButton";
import type { OneXTwo } from "../../types";

interface ButtonGroupProps {
  eventNumber: number;
  valueStrength1?: number | string;
  valueStrengthX?: number | string;
  valueStrength2?: number | string;
  onChange: (eventNumber: number, selections: OneXTwo[]) => void;
}

const ButtonGroup = ({
  eventNumber,
  valueStrength1,
  valueStrengthX,
  valueStrength2,
  onChange,
}: ButtonGroupProps) => {
  const [values, setValues] = React.useState<
    [SelectionValue, SelectionValue, SelectionValue]
  >([0, 0, 0]);

  const [home, draw, away] = values;

  const selected = React.useMemo<OneXTwo[]>(() => {
    const s: OneXTwo[] = [];
    if (home > 0) s.push(1);
    if (draw > 0) s.push(2);
    if (away > 0) s.push(3);
    return s;
  }, [home, draw, away]);

  React.useEffect(() => {
    onChange(eventNumber, selected);
  }, [eventNumber, selected, onChange]);

  const updateValue = (index: 0 | 1 | 2, value: SelectionValue) => {
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
        <SelectionButton value={home} valueStrength={valueStrength1} onChange={v => updateValue(0, v)} />
        <div className="weight">{weights[0] ? `${weights[0]}%` : ""}</div>
      </div>

      <div className="buttonColumn">
        <SelectionButton value={draw} valueStrength={valueStrengthX} onChange={v => updateValue(1, v)} />
        <div className="weight">{weights[1] ? `${weights[1]}%` : ""}</div>
      </div>

      <div className="buttonColumn">
        <SelectionButton value={away} valueStrength={valueStrength2} onChange={v => updateValue(2, v)} />
        <div className="weight">{weights[2] ? `${weights[2]}%` : ""}</div>
      </div>
    </div>
  );
};

export default ButtonGroup;
