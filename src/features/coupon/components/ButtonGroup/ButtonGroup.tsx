import React from "react";
import "./ButtonGroup.css";
import SelectionButton from "../SelectionButton/SelectionButton";
import type { SelectionValue } from "../../types/couponDataTypes";

/** ----- Types ----- */

interface ButtonGroupProps {
  eventNumber: number;
  initialValues?: [SelectionValue, SelectionValue, SelectionValue];
  valueStrength1?: number | string;
  valueStrengthX?: number | string;
  valueStrength2?: number | string;
  displayMode: 'grade' | 'weight' | 'both';
  onChange: (
    eventNumber: number,
    values: [SelectionValue, SelectionValue, SelectionValue]
  ) => void;
}


/** ----- Component ----- */

const ButtonGroup = ({
  eventNumber,
  initialValues,
  valueStrength1,
  valueStrengthX,
  valueStrength2,
  displayMode,

  
  onChange,
}: ButtonGroupProps) => {
  const [values, setValues] = React.useState<
    [SelectionValue, SelectionValue, SelectionValue]
  >(initialValues ?? [0, 0, 0]);

  React.useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

const showGradeInButton = displayMode === 'grade';
const showWeightBelow = displayMode === 'grade'; // weight is only shown when grade is selected
  const [home, draw, away] = values;

  /** ----- Weight distribution ----- */
  const weights = React.useMemo<[number, number, number]>(() => {
    const total = values.reduce<number>((sum, v) => sum + v, 0);

    if (total === 0) return [0, 0, 0];

    return values.map(v =>
      Math.round((v / total) * 100)
    ) as [number, number, number];
  }, [values]);


  /** ----- Notify parent ----- */
  React.useEffect(() => {
    onChange(eventNumber, values);
  }, [eventNumber, values, onChange]);


  /** ----- Update value ----- */
  const updateValue = (index: 0 | 1 | 2, value: SelectionValue) => {
    setValues(prev => {
      const next = [...prev] as typeof prev;
      next[index] = value;
      return next;
    });
  };

  /** ----- Render ----- */

  return (
    <div className="buttonGroup">
      <div className="buttonColumn">
        <SelectionButton value={home} valueStrength={valueStrength1} weight={weights[0]} displayMode={showGradeInButton ? 'grade' : 'weight'} onChange={v => updateValue(0, v)} />
        {showWeightBelow && (
      <div className="weight">
        {weights[0] ? `${weights[0]}%` : ''}
      </div>
    )}
      </div>

      <div className="buttonColumn">
        <SelectionButton value={draw} valueStrength={valueStrengthX} weight={weights[1]} displayMode={showGradeInButton ? 'grade' : 'weight'} onChange={v => updateValue(1, v)} />
        {showWeightBelow && (
      <div className="weight">
        {weights[1] ? `${weights[1]}%` : ''}
      </div>
    )}
      </div>

      <div className="buttonColumn">
        <SelectionButton value={away} valueStrength={valueStrength2} weight={weights[2]} displayMode={showGradeInButton ? 'grade' : 'weight'} onChange={v => updateValue(2, v)} />
        {showWeightBelow && (
      <div className="weight">
        {weights[2] ? `${weights[2]}%` : ''}
      </div>
    )}
      </div>
    </div>
  );
};

export default ButtonGroup;
