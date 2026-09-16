import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for JSON and urlencoded
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 1. API routes FIRST (before static serving or fallback handlers)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Utilix.bd',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/capabilities', (req, res) => {
    res.json({
      prerendered: true,
      routes: ['/', '/converter', '/photo-resizer', '/age-calculator', '/amount-in-words']
    });
  });

  // 2. Vite middleware in Development OR Static Serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    // Serve static assets from dist (css, js, media, fonts)
    app.use(express.static(distPath, {
      index: false,
      maxAge: '1h'
    }));

    // Specific route handler for prerendered pages
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        return next();
      }

      // Ignore API requests if any slipped through
      if (req.path.startsWith('/api')) {
        return next();
      }

      const reqPath = req.path.replace(/\/+$/, '') || '/';
      const cleanPath = reqPath === '/' ? '' : reqPath.replace(/^\//, '');
      const potentialHtmlPath = cleanPath
        ? path.join(distPath, cleanPath, 'index.html')
        : path.join(distPath, 'index.html');

      if (fs.existsSync(potentialHtmlPath)) {
        return res.sendFile(potentialHtmlPath);
      }

      next();
    });

    // Fallback for any other client-side SPA routes (Express v5 format)
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Utilix.bd server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
