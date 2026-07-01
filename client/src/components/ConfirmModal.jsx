/**
 * =============================================================================
 * CONFIRM MODAL — ARCHIVE TERMINAL v3.0
 * =============================================================================
 * Metal-framed danger confirmation dialog with screw heads.
 */

import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, resourceTitle }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="alertdialog" aria-modal="true">
      <div
        className="metal-frame w-full max-w-sm mx-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Screws */}
        <div className="screw screw-tl" />
        <div className="screw screw-tr" />
        <div className="screw screw-bl" />
        <div className="screw screw-br" />

        {/* Accent bar */}
        <div className="metal-accent-bar" style={{ background: 'linear-gradient(90deg, #ff3366, #ff00cc, #ffaa00)' }} />

        <div className="metal-inner m-3 p-6 text-center">
          {/* Warning icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{ background: 'rgba(255, 51, 102, 0.06)', border: '1px solid rgba(255, 51, 102, 0.25)' }}
            >
              <svg className="w-8 h-8" style={{ color: '#ff3366' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>

          <h2 className="font-mono text-sm font-bold text-text-primary mb-2 tracking-wider">CONFIRM DELETION</h2>
          <p className="text-sm text-text-secondary mb-1">You are about to permanently remove:</p>
          <p className="font-mono text-sm font-bold mb-4 px-2" style={{ color: '#ff3366' }}>"{resourceTitle}"</p>
          <p className="font-mono text-[0.6rem] text-text-muted mb-5">{'// This action cannot be undone.'}</p>

          <div className="flex items-center justify-center gap-3">
            <button onClick={onClose} className="btn-neon btn-magenta">CANCEL</button>
            <button onClick={handleConfirm} className="btn-neon btn-red">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              DELETE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
