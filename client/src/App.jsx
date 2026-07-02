/**
 * =============================================================================
 * APP — ARCHIVE TERMINAL v4.0
 * =============================================================================
 * Root component. Layers:
 * 1. Three.js WebGL server room scene (z-index: 0, fixed)
 * 2. Vignette overlay (z-index: 1, fixed)
 * 3. Scanlines overlay (z-index: 9990, fixed)
 * 4. Navbar (z-index: 100, fixed)
 * 5. Main content (z-index: 10, relative)
 * 6. Carbon fiber console desk (z-index: 50, fixed bottom)
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Navbar    from './components/Navbar';
import Dashboard from './components/Dashboard';
import './App.css';

// Lazy load the heavy WebGL scene
const Scene3D = lazy(() => import('./components/Scene3D'));

function App() {
  // Global typing sparks effect
  useEffect(() => {
    const handleInput = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.classList.remove('input-typing');
        void e.target.offsetWidth; // Trigger reflow to restart animation
        e.target.classList.add('input-typing');
      }
    };
    document.addEventListener('input', handleInput);
    return () => document.removeEventListener('input', handleInput);
  }, []);

  return (
    <Router>
      {/* Layer 1: Three.js WebGL Background */}
      <Suspense fallback={
        <div className="webgl-canvas" style={{ background: 'linear-gradient(180deg, #040408 0%, #080816 40%, #040408 100%)' }} />
      }>
        <Scene3D />
      </Suspense>

      {/* Layer 2: Vignette */}
      <div className="vignette" aria-hidden="true" />

      {/* Layer 3: Scanlines */}
      <div className="scanlines" aria-hidden="true" />

      {/* Layer 4: Fixed Navbar */}
      <Navbar />

      {/* Layer 5: Main content */}
      <main
        className="relative z-10 pt-24 pb-32 px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: '1300px', margin: '0 auto' }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Layer 6: Carbon fiber console desk */}
      <div className="console-desk" aria-hidden="true">
        <img src="/assets/console-desk.png" alt="" className="console-desk-img" draggable="false" />
      </div>
    </Router>
  );
}

export default App;
