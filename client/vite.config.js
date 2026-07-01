/**
 * =============================================================================
 * VITE CONFIGURATION — ARCHIVE TERMINAL
 * =============================================================================
 * 
 * This configuration sets up:
 * 1. React plugin for JSX/Fast Refresh support
 * 2. Tailwind CSS v4 via the official Vite plugin (no PostCSS config needed)
 * 3. Dev server on port 5173 with API proxy to the Express backend on port 5000
 * 
 * The proxy ensures that any request to /api/* is forwarded to the backend,
 * avoiding CORS issues during development while keeping the frontend and
 * backend on separate ports.
 * =============================================================================
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),        // Enables JSX transform and React Fast Refresh
    tailwindcss(),  // Tailwind CSS v4 Vite-native integration
  ],
  server: {
    port: 5173, // Default Vite dev server port
    proxy: {
      // Proxy all /api requests to the Express backend
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true, // Changes the origin header to match the target
      },
    },
  },
})
