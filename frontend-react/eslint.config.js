/**
 * ESLint configuration for Mental Health Companion frontend.
 * 
 * Provides code quality and style checking for JavaScript and React code.
 * Uses flat config format (ESLint 9+).
 */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Ignore build output directory
  globalIgnores(['dist']),
  
  {
    // Apply to all JavaScript and JSX files
    files: ['**/*.{js,jsx}'],
    
    // Extend recommended configurations
    extends: [
      js.configs.recommended, // ESLint recommended rules
      reactHooks.configs['recommended-latest'], // React Hooks rules
      reactRefresh.configs.vite, // React Refresh for Vite
    ],
    
    // Language options
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Browser globals (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // ES modules
      },
    },
    
    // Custom rules
    rules: {
      // Allow unused variables that start with uppercase (constants, components)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);

      ecmaVersion: 2020,
      globals: globals.browser, // Browser globals (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // ES modules
      },
    },
    
    // Custom rules
    rules: {
      // Allow unused variables that start with uppercase (constants, components)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);

      ecmaVersion: 2020,
      globals: globals.browser, // Browser globals (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // ES modules
      },
    },
    
    // Custom rules
    rules: {
      // Allow unused variables that start with uppercase (constants, components)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);

      ecmaVersion: 2020,
      globals: globals.browser, // Browser globals (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // ES modules
      },
    },
    
    // Custom rules
    rules: {
      // Allow unused variables that start with uppercase (constants, components)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },