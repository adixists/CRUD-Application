/**
 * =============================================================================
 * SPACE HUD — Archive Terminal v4.0
 * =============================================================================
 * AI-generated rocket image with CSS fly-in animation.
 * - Rocket flies from left to center on page load
 * - Live flickering exhaust fire image behind the rocket
 * - Three stat windows overlaid on the rocket body
 * - Deep space AI background
 * - CSS particle sparks from exhaust
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  EXHAUST SPARK PARTICLES (pure CSS + JS canvas)                              */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ExhaustCanvas({ parentRef }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const createParticle = useCallback((w, h, exhaustX, exhaustY) => {
    return {
      x: exhaustX + Math.random() * 10,
      y: exhaustY + (Math.random() - 0.5) * 30,
      vx: -(1 + Math.random() * 4),
      vy: (Math.random() - 0.5) * 1.5,
      life: 0.6 + Math.random() * 0.5,
      maxLife: 0.6 + Math.random() * 0.5,
      size: 1 + Math.random() * 3,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d');
    let running = true;
    let lastTime = performance.now();

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (now) => {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Exhaust origin — roughly where the rocket nozzle is
      // Rocket center is at 50%, exhaust is at its left tail (~20% from left when settled)
      const exhaustX = canvas.width * 0.28;
      const exhaustY = canvas.height * 0.5;

      // Spawn new particles
      for (let i = 0; i < 3; i++) {
        if (particlesRef.current.length < 150) {
          particlesRef.current.push(createParticle(canvas.width, canvas.height, exhaustX, exhaustY));
        }
      }

      // Update & draw
      particlesRef.current = particlesRef.current.filter(p => {
        p.life -= dt;
        if (p.life <= 0) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += (Math.random() - 0.5) * 0.3;

        const age = 1 - (p.life / p.maxLife);
        let r, g, b, a;
        if (age < 0.15) {
          r = 255; g = 255; b = 220; a = 0.9;
        } else if (age < 0.4) {
          r = 255; g = 180 - age * 200; b = 50; a = 0.8;
        } else if (age < 0.7) {
          r = 255; g = 80; b = 0; a = 0.6 - age * 0.3;
        } else {
          r = 180; g = 30; b = 0; a = 0.3 * (1 - age);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - age * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5 * (1 - age * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.15})`;
        ctx.fill();

        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [parentRef, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  STAT WINDOW — glass porthole with number                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StatWindow({ value, label, color, delay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="rocket-stat-window"
      style={{
        '--stat-color': color,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.7)',
      }}
    >
      <div className="rsw-ring" />
      <div className="rsw-inner">
        <div className="rsw-value">{String(value).padStart(2, '0')}</div>
        <div className="rsw-label">{label}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */
const HolOrbs = ({ total, active, archived }) => {
  const containerRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Trigger fly-in after mount
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-hud" ref={containerRef}>
      {/* ── Space background image ── */}
      <div className="space-hud-bg" />

      {/* ── Exhaust fire image (behind rocket) ── */}
      <div className={`exhaust-fire ${entered ? 'entered' : ''}`}>
        <img src="/images/exhaust.png" alt="" draggable="false" />
      </div>

      {/* ── Canvas particle sparks ── */}
      <ExhaustCanvas parentRef={containerRef} />

      {/* ── Rocket image ── */}
      <div className={`rocket-ship ${entered ? 'entered' : ''}`}>
        <img src="/images/rocket.png" alt="Rocket" draggable="false" />
      </div>

      {/* ── Stat windows overlaid ── */}
      <div className="space-hud-stats">
        <StatWindow value={total}    label="TOTAL"    color="#00c8ff" delay={1400} />
        <StatWindow value={active}   label="ACTIVE"   color="#00e87a" delay={1700} />
        <StatWindow value={archived} label="ARCHIVED" color="#cc44ff" delay={2000} />
      </div>

      {/* ── HUD decorations ── */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
      <div className="hud-scan-bar" />
    </div>
  );
};

export default HolOrbs;
