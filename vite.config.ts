import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';

export default defineConfig(({ isSsrBuild }): UserConfig => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ssr: {
      external: ['express', 'react', 'react-dom', 'react-router-dom'],
      noExternal: ['react-helmet-async'],
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      minify: 'esbuild',
      sourcemap: process.env.NODE_ENV === 'development',
      rollupOptions: isSsrBuild
        ? {}
        : {
            output: {
              manualChunks: {
                vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
              },
            },
          },
    },
  };
});
