/**
 * =============================================================================
 * APP COMPONENT — ARCHIVE TERMINAL v3.0
 * =============================================================================
 * Root application component. Sets up React Router, the fixed Navbar,
 * and main content area with the Dashboard.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: '#060610' }}>
        {/* Fixed Navbar — ADD RESOURCE button is managed by Dashboard */}
        <Navbar />

        {/* Main content — extra bottom padding for console desk */}
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
