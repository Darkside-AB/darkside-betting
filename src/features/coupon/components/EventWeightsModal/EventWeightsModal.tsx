import React from "react";
import "./EventWeightsModal.css";

interface EventWeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weightsByEvent: Record<number, [number, number, number]>;
}

const EventWeightsModal = ({
  isOpen,
  onClose,
  weightsByEvent,
}: EventWeightsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <header className="modal-header">
          <h3>System distribution</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </header>

        <table className="weights-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>1</th>
              <th>X</th>
              <th>2</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(weightsByEvent).map(
              ([event, [w1, wX, w2]]) => (
                <tr key={event}>
                  <td>{event}</td>
                  <td>{w1}%</td>
                  <td>{wX}%</td>
                  <td>{w2}%</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventWeightsModal;
