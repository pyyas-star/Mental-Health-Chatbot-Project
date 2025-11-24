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

export default defineConfig({
  plugins: [
    react(), // Enables React Fast Refresh and JSX support
  ],
  
  // Development server configuration
  server: {
    port: 5173, // Default Vite dev server port
    open: false, // Don't auto-open browser
    cors: true, // Enable CORS for API requests
  },
  
  // Build configuration
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster minification
  },
});


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // Enables React Fast Refresh and JSX support
  ],
  
  // Development server configuration
  server: {
    port: 5173, // Default Vite dev server port
    open: false, // Don't auto-open browser
    cors: true, // Enable CORS for API requests
  },
  
  // Build configuration
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster minification
  },
});


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // Enables React Fast Refresh and JSX support
  ],
  
  // Development server configuration
  server: {
    port: 5173, // Default Vite dev server port
    open: false, // Don't auto-open browser
    cors: true, // Enable CORS for API requests
  },
  
  // Build configuration
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster minification
  },
});


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // Enables React Fast Refresh and JSX support
  ],
  
  // Development server configuration
  server: {
    port: 5173, // Default Vite dev server port
    open: false, // Don't auto-open browser
    cors: true, // Enable CORS for API requests
  },
  
  // Build configuration
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster minification
  },
});
