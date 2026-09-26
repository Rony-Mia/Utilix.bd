// Route constants shared between client routing and build-time prerendering.
// Keeping these in a pure constants module allows prerender.ts to discover routes
// without triggering full component module trees in unbundled Node.js (tsx).

export const NOT_FOUND_ROUTE = '/__404__';

export const PRERENDER_ROUTES = [
  '/',
  '/converter',
  '/photo-resizer',
  '/bulk-photo-resizer',
  '/heic-converter',
  '/image-merger',
  '/qr-generator',
  '/age-calculator',
  '/amount-in-words',
  '/bangla-date-converter',
  '/cv-builder',
  '/gpa-calculator',
  '/land-converter',
  '/pdf-merger',
  '/pdf-split',
  '/pdf-delete-pages',
  '/pdf-rotate',
  '/pdf-watermark-page-number',
  '/about',
  '/contact',
  '/privacy-policy',
  '/blog',
  '/blog/teletalk-photo-signature-resize-guide',
  '/blog/bijoy-to-unicode-conversion-tips',
  '/blog/bangla-date-calculation-rules',
  '/blog/gpa-cgpa-grading-system-rules',
] as const;
