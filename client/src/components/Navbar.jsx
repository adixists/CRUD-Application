/**
 * =============================================================================
 * NAVBAR — ARCHIVE TERMINAL v4.0
 * =============================================================================
 * Features:
 * - Beveled heavy metal 3D enclosure around logo/title
 * - Animated cyan/magenta orb logo
 * - GSAP typing animation for "ARCHIVE TERMINAL" on mount
 * - Green ONLINE status indicator
 * - + ADD RESOURCE button with glitch hover
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Navbar = ({ onAddResource }) => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const title = '// ARCHIVE TERMINAL';
    const sub   = '// V2.0 · DIGITAL LIBRARY';

    // Typing animation using GSAP
    const typeText = (el, text, delay = 0) => {
      if (!el) return;
      el.textContent = '';
      const chars = text.split('');
      chars.forEach((char, i) => {
        gsap.to(el, {
          delay: delay + i * 0.04,
          duration: 0,
          onStart: () => { el.textContent += char; },
        });
      });
    };

    typeText(titleRef.current, title, 0.3);
    typeText(subtitleRef.current, sub, 1.5);
  }, []);

  return (
    <nav className="navbar">
      {/* LEFT — Beveled metal logo enclosure */}
      <div className="nav-logo-box">
        {/* Glowing Orb Logo */}
        <div className="logo-orb">
          <div className="logo-orb-inner" />
        </div>

        {/* Title text */}
        <div className="nav-title">
          <div className="nav-title-main">
            <span className="neon-cyan" ref={titleRef}></span>
          </div>
          <div className="nav-title-sub" ref={subtitleRef}></div>
        </div>
      </div>

      {/* RIGHT — Status + button */}
      <div className="nav-right">
        {/* Online indicator */}
        <div className="status-online">
          <div className="status-dot" />
          <span className="status-text">ONLINE</span>
        </div>

        <span className="nav-divider hidden md:block">// DIGITAL LIBRARY V2.0</span>

        {/* Add Resource */}
        {onAddResource && (
          <button
            onClick={onAddResource}
            className="btn-neon btn-cyan btn-glitch"
            id="btn-add-resource"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            + ADD RESOURCE
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
