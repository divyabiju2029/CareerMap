
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Shimming process.env for compatibility with the Gemini SDK requirements
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': process.env
  }
});
