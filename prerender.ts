import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PRERENDER_ROUTES } from './src/routes.tsx';

// Single source of truth: routes come from src/routes.tsx.
// Add a new tool's path there once and it is automatically
// prerendered here AND included in the generated sitemap.xml below.
const ROUTES: readonly string[] = PRERENDER_ROUTES;

const SITE_ORIGIN = 'https://utilix.bd';

function generateSitemap(routes: readonly string[]): string {
  const urlEntries = routes
    .map((route) => {
      const loc = `${SITE_ORIGIN}${route === '/' ? '/' : route}`;
      const priority = route === '/' ? '1.0' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

async function prerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const serverEntryPath = path.resolve(distDir, 'server/entry-server.js');
  const templatePath = path.resolve(distDir, 'index.html');

  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`Server entry file not found at ${serverEntryPath}`);
  }
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client template index.html not found at ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Dynamic import of the compiled SSR bundle
  const { render } = await import(pathToFileURL(serverEntryPath).href);

  for (const url of ROUTES) {
    console.log(`[prerender] Rendering route: ${url}`);
    const { html: renderedHtml, helmet } = render(url);

    // Extract title and meta tags from rendered HTML
    const titleMatch = renderedHtml.match(/<title>[\s\S]*?<\/title>/);
    const newTitle = titleMatch ? titleMatch[0] : '';

    // Extract meta tags from rendered output
    const metaMatches = renderedHtml.match(/<meta\s+[^>]*\/?>/g) || [];

    // Extract body by stripping title and meta tags from rendered output
    const bodyHtml = renderedHtml
      .replace(/<title>[\s\S]*?<\/title>/g, '')
      .replace(/<meta\s+[^>]*\/?>/g, '')
      .trim();

    // Inject into template
    let pageHtml = template;

    // 1. Replace or update <title> from Helmet or rendered HTML
    const finalTitle = newTitle || (helmet?.title?.toString() || '');
    if (finalTitle) {
      if (pageHtml.includes('<title>')) {
        pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/, finalTitle);
      } else {
        pageHtml = pageHtml.replace('</head>', `  ${finalTitle}\n</head>`);
      }
    }

    // 2. Handle meta tags from Helmet context
    let allMetaTags = metaMatches || [];
    
    // Extract meta tags from Helmet if available
    if (helmet?.meta) {
      const helmetMetaHtml = helmet.meta.toString();
      // Extract individual meta tags from helmet output
      const helmetMetaMatches = helmetMetaHtml.match(/<meta\s+[^>]*\/?>/g) || [];
      allMetaTags = [...allMetaTags, ...helmetMetaMatches];
    }

    // Remove default meta description/og/twitter tags from template to avoid duplicates
    if (allMetaTags.length > 0) {
      pageHtml = pageHtml.replace(/<meta\s+name="description"[^>]*\/?>\s*/gi, '');
      pageHtml = pageHtml.replace(/<meta\s+property="og:[^"]*"[^>]*\/?>\s*/gi, '');
      pageHtml = pageHtml.replace(/<meta\s+name="twitter:[^"]*"[^>]*\/?>\s*/gi, '');

      // Deduplicate meta tags by name/property
      const metaMap = new Map<string, string>();
      for (const metaTag of allMetaTags) {
        const nameMatch = metaTag.match(/name="([^"]*)"/);
        const propertyMatch = metaTag.match(/property="([^"]*)"/);
        const key = nameMatch ? nameMatch[1] : (propertyMatch ? propertyMatch[1] : null);
        
        if (key) {
          metaMap.set(key, metaTag);
        }
      }

      const dedupedMetaTags = Array.from(metaMap.values());
      const metaTagsStr = dedupedMetaTags.map((m: string) => `    ${m}`).join('\n');
      
      if (pageHtml.includes('</head>')) {
        pageHtml = pageHtml.replace('</head>', `${metaTagsStr}\n  </head>`);
      }
    }

    // 2b. Inject a page-specific canonical link (drop any leftover one
    // from the template first so repeated builds don't duplicate it).
    pageHtml = pageHtml.replace(/<link\s+rel="canonical"[^>]*\/?>\s*/gi, '');
    const canonicalHref = `${SITE_ORIGIN}${url === '/' ? '/' : url}`;
    pageHtml = pageHtml.replace(
      '</head>',
      `  <link rel="canonical" href="${canonicalHref}"/>\n</head>`
    );

    // 3. Inject body content into <div id="root">
    pageHtml = pageHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${bodyHtml}</div>`
    );

    // 4. Save to destination
    const routeClean = url === '/' ? '' : url.replace(/^\//, '');
    const outDir = routeClean ? path.join(distDir, routeClean) : distDir;
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, pageHtml, 'utf-8');
    console.log(`[prerender] Wrote: ${outFile} (${(pageHtml.length / 1024).toFixed(1)} KB)`);
  }

  // 5. Clean up temporary dist/server folder
  const serverDir = path.resolve(distDir, 'server');
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
    console.log('[prerender] Cleaned up temporary dist/server directory.');
  }

  // 6. Auto-generate sitemap.xml from the same ROUTES list used above,
  // so a new tool's route only needs to be added once (in src/routes.tsx).
  const sitemapXml = generateSitemap(ROUTES);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`[prerender] Wrote: ${path.join(distDir, 'sitemap.xml')} (${ROUTES.length} routes)`);

  console.log('[prerender] All routes successfully prerendered!');
}

prerender().catch((err) => {
  console.error('[prerender] Error during prerender:', err);
  process.exit(1);
});
