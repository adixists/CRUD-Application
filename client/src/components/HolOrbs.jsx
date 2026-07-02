/**
 * =============================================================================
 * SERVER ROOM HUD — Archive Terminal v4.0
 * =============================================================================
 * A cyberpunk server room dashboard with:
 * - Animated data-stream columns (vertical flowing bits)
 * - Three glowing server monitor panels showing TOTAL / ACTIVE / ARCHIVED
 * - Blinking rack LEDs across the background
 * - Horizontal scan-line sweep
 * - Pulsing power indicators
 * - All pure CSS + minimal JS — no Three.js, no images
 */

import React, { useState, useEffect, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  DATA STREAM COLUMNS — vertical falling "bits"                               */
/* ═══════════════════════════════════════════════════════════════════════════ */
function DataStreams() {
  const streams = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 28; i++) {
      arr.push({
        left: `${(i / 28) * 100 + Math.random() * 2}%`,
        duration: 2 + Math.random() * 4,
        delay: Math.random() * 3,
        opacity: 0.04 + Math.random() * 0.08,
        char: ['0', '1', '█', '▓', '░', '│', '┃'][Math.floor(Math.random() * 7)],
      });
    }
    return arr;
  }, []);

  return (
    <div className="srv-data-streams">
      {streams.map((s, i) => (
        <div
          key={i}
          className="srv-stream-col"
          style={{
            left: s.left,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
          }}
        >
          {Array.from({ length: 12 }, (_, j) => (
            <span key={j} style={{ animationDelay: `${j * 0.15}s` }}>
              {['0', '1', '█', '▓', '░'][Math.floor(Math.random() * 5)]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  RACK LEDs — rows of blinking indicator lights                               */
/* ═══════════════════════════════════════════════════════════════════════════ */
function RackLEDs() {
  const leds = useMemo(() => {
    const arr = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 40; col++) {
        arr.push({
          top: `${18 + row * 28}%`,
          left: `${col * 2.5 + 0.5}%`,
          color: ['#00f0ff', '#00ff88', '#ff00cc', '#ffaa00', '#a855f7'][Math.floor(Math.random() * 5)],
          delay: Math.random() * 5,
          duration: 0.5 + Math.random() * 3,
          size: 2 + Math.random() * 2,
        });
      }
    }
    return arr;
  }, []);

  return (
    <div className="srv-rack-leds">
      {leds.map((led, i) => (
        <div
          key={i}
          className="srv-led"
          style={{
            top: led.top,
            left: led.left,
            width: `${led.size}px`,
            height: `${led.size}px`,
            backgroundColor: led.color,
            boxShadow: `0 0 ${led.size * 2}px ${led.color}`,
            animationDuration: `${led.duration}s`,
            animationDelay: `${led.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SERVER MONITOR — a single stat display panel                                */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ServerMonitor({ value, label, color, delay }) {
  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Count-up animation
  useEffect(() => {
    if (!visible) return;
    const target = value;
    if (target === 0) { setDisplayValue(0); return; }
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const iv = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(iv); }
      setDisplayValue(current);
    }, 50);
    return () => clearInterval(iv);
  }, [visible, value]);

  return (
    <div
      className="srv-monitor"
      style={{
        '--srv-color': color,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
      }}
    >
      {/* Screen bezel */}
      <div className="srv-bezel">
        {/* CRT scanlines */}
        <div className="srv-scanlines" />

        {/* Power LED */}
        <div className="srv-power-led" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />

        {/* Screen content */}
        <div className="srv-screen">
          {/* Top bar */}
          <div className="srv-screen-header">
            <span className="srv-header-dot" style={{ backgroundColor: color }} />
            <span className="srv-header-text">{label}</span>
            <span className="srv-header-dot" style={{ backgroundColor: color }} />
          </div>

          {/* Big number */}
          <div className="srv-number" style={{ color, textShadow: `0 0 20px ${color}, 0 0 40px ${color}66` }}>
            {String(displayValue).padStart(2, '0')}
          </div>

          {/* Bottom bar with activity indicator */}
          <div className="srv-screen-footer">
            <div className="srv-activity-bar">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="srv-activity-segment"
                  style={{
                    backgroundColor: i < Math.min(value + 2, 8) ? color : 'rgba(255,255,255,0.05)',
                    animationDelay: `${i * 0.12}s`,
                    opacity: i < Math.min(value + 2, 8) ? undefined : 0.3,
                  }}
                />
              ))}
            </div>
            <span className="srv-footer-text" style={{ color: `${color}88` }}>ONLINE</span>
          </div>
        </div>
      </div>

      {/* Label below monitor */}
      <div className="srv-label" style={{ color: `${color}cc` }}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SERVER ROOM WIRES — horizontal connection lines between monitors            */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ConnectionWires() {
  return (
    <div className="srv-wires">
      <div className="srv-wire srv-wire-1" />
      <div className="srv-wire srv-wire-2" />
      <div className="srv-wire-pulse srv-wire-pulse-1" />
      <div className="srv-wire-pulse srv-wire-pulse-2" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */
const HolOrbs = ({ total, active, archived }) => {
  return (
    <div className="srv-room">
      {/* Background layers */}
      <div className="srv-bg" />
      <RackLEDs />
      <DataStreams />
      <ConnectionWires />

      {/* Three server monitors */}
      <div className="srv-monitors">
        <ServerMonitor value={total}    label="TOTAL"    color="#00f0ff" delay={300}  />
        <ServerMonitor value={active}   label="ACTIVE"   color="#00ff88" delay={600}  />
        <ServerMonitor value={archived} label="ARCHIVED" color="#a855f7" delay={900}  />
      </div>

      {/* HUD corner brackets */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
      <div className="hud-scan-bar" />
    </div>
  );
};

export default HolOrbs;
