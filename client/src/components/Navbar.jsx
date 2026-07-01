/**
 * =============================================================================
 * NAVBAR — ARCHIVE TERMINAL v3.0
 * =============================================================================
 * Features a CSS planet logo with orbital ring, gradient title,
 * and green ONLINE status indicator.
 */

import React from 'react';

const Navbar = ({ onAddResource }) => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center justify-between px-5 lg:px-8"
      style={{
        background: 'rgba(6, 6, 16, 0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.06)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(0,240,255,0.04)',
      }}
    >
      {/* Left: Planet Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Planet with orbital ring */}
        <div className="planet-logo" aria-label="Archive Terminal">
          <div className="planet-ring-back" />
          <div className="planet-body" />
          <div className="planet-ring" />
        </div>

        <div className="flex flex-col">
          <h1 className="font-mono font-bold tracking-widest leading-none text-base">
            <span className="neon-text">ARCHIVE</span>
            <span className="text-text-primary ml-1">TERMINAL</span>
          </h1>
          <span className="font-mono text-[0.55rem] text-text-muted tracking-[0.18em] uppercase mt-0.5">
            // V2.0 · DIGITAL LIBRARY
          </span>
        </div>
      </div>

      {/* Right: Status + Add Button */}
      <div className="flex items-center gap-4">
        {/* Online status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ border: '1px solid rgba(0,255,136,0.18)', background: 'rgba(0,255,136,0.04)' }}>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#00ff88',
              boxShadow: '0 0 8px rgba(0, 255, 136, 0.8)',
              animation: 'orbPulse 2s ease-in-out infinite',
            }}
          />
          <span className="font-mono text-[0.6rem] text-neon-green tracking-widest">ONLINE</span>
        </div>

        <span className="font-mono text-[0.6rem] text-text-muted hidden md:block">
          {'// DIGITAL LIBRARY V2.0'}
        </span>

        {/* Add Resource button */}
        {onAddResource && (
          <button onClick={onAddResource} className="btn-neon btn-cyan !py-2 !px-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            ADD RESOURCE
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
