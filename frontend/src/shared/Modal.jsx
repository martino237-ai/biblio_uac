import React from 'react';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn outline btn-enhanced" onClick={onClose}>X</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
