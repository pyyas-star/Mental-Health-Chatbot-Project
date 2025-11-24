/**
 * Vite configuration for Mental Health Companion frontend.
 * 
 * Vite is used as the build tool and development server for the React application.
 * Configuration includes React plugin for JSX/TSX support and HMR (Hot Module Replacement).
 * 
 * @see https://vite.dev/config/
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Server configuration for development
  server: {
    port: 5174, // Ensure this matches your development port
    open: true, // Open browser automatically
    cors: true, // Enable CORS for development
  },
  // Build configuration for production
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Use esbuild for faster minification
  },
})
