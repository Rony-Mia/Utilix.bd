# Utools.bd — বাংলা ডিজিটাল ইউটিলিটি হাব

A complete browser-based Bengali utility toolkit featuring Bijoy ↔ Unicode conversion, government photo resizing, age calculation, and amount-to-words conversion. **100% client-side processing—your data never leaves your browser.**

## Features

✨ **4 Powerful Tools:**
- 🔤 **Bijoy ↔ Unicode Converter** — Convert legacy ANSI fonts (SutonnyMJ) to modern Unicode
- 📷 **Photo Resizer** — Government & passport photo specs (300×300, 300×80 signature)
- 🎂 **Age Calculator** — Exact age calculation for government job applications
- 💰 **Amount in Words** — Convert numbers to Bengali words for bank checks & deeds

🔒 **Privacy-First:**
- 100% browser-based processing
- No server uploads
- Works offline
- Open source & transparent

⚡ **Performance:**
- Server-side rendering (SSR) with static prerendering
- Fast hydration & client-side interactivity
- Optimized bundles & caching

## Tech Stack

- **Frontend:** React 19 + React Router 7 + TypeScript
- **Styling:** Tailwind CSS 4 + Vite
- **SSR:** React DOM Server + Static Prerendering
- **Server:** Express 5 (production) + Vite Middleware (dev)
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Tiro Bangla, Hind Siliguri, JetBrains Mono)

## Project Structure

```
src/
  pages/              Page components (Home, Converter, PhotoResizer, AgeCalculator, AmountInWords)
  components/         Reusable UI components (Navbar, Footer)
  bijoyConverter.ts   Bijoy ↔ Unicode conversion engine (~240 lines)
  amountToWords.ts    Number-to-words converter (~420 lines)
  routes.tsx          React Router configuration
  types.ts            TypeScript interfaces
  App.tsx             Root layout with Helmet context
  main.tsx            Client entry point
  entry-server.tsx    SSR entry point (renders to string)
  entry-client.tsx    Hydration logic
  constants/
    presets.ts        Government photo presets (5 profiles)

server.ts            Express server (dev & prod modes)
prerender.ts         Static HTML generation script
vite.config.ts       Build configuration with SSR setup
index.html           HTML template
package.json         Dependencies & build scripts
```

## Getting Started

### Prerequisites
- Node.js 18+ (or Bun 1.0+)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone repository
git clone https://github.com/Rony-Mia/Utools.bd.git
cd Utools.bd

# Install dependencies
bun install
# or: npm install
```

### Development

```bash
# Start dev server with HMR (hot reload)
bun dev
# Server runs on http://localhost:3000
```

**Features:**
- Vite middleware mode with live reload
- React Fast Refresh for component updates
- Source maps for debugging

### Production Build

```bash
# Full build pipeline:
# 1. Build SPA (client)
# 2. Build SSR bundle (server)
# 3. Prerender static HTML for all routes
# 4. Bundle server.ts for production
bun build

# Output: dist/
# ├── index.html (home page)
# ├── converter/index.html
# ├── photo-resizer/index.html
# ├── age-calculator/index.html
# ├── amount-in-words/index.html
# ├── assets/ (bundled JS/CSS)
# └── server.cjs (production Express server)
```

### Start Production Server

```bash
# Serve prerendered static pages via Express
bun start
# Server runs on http://localhost:3000

# Or specify port:
PORT=8080 bun start
```

### API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Server capabilities
curl http://localhost:3000/api/capabilities
```

## SSR & Prerendering

### How It Works

1. **Development Mode:** Vite middleware + React Fast Refresh
   ```bash
   bun dev
   ```

2. **Production Build:** 3-step process
   - **Step 1:** Vite builds client SPA (`dist/`)
   - **Step 2:** Vite builds SSR bundle (`dist/server/entry-server.js`)
   - **Step 3:** `prerender.ts` generates static HTML from SSR output
     - Calls `render(url)` for each route
     - Injects Helmet meta tags (title, og, twitter, description)
     - Hydrates pages with client JavaScript
   - **Step 4:** esbuild bundles Express server

3. **Production Runtime:** Express serves prerendered pages
   ```
   Request → Express static middleware → dist/[route]/index.html → Client hydration
   ```

### Why Static Prerendering?

✅ **Performance:** Pre-generated HTML = instant page loads  
✅ **SEO:** Meta tags indexed by search engines  
✅ **Reliability:** No server-side rendering delays  
✅ **Hosting:** Deploy as static files (CDN-friendly)  

### Hydration Process

```tsx
// entry-client.tsx: Detects SSR content and hydrates
if (container.hasChildNodes() && container.innerHTML.trim().length > 0) {
  hydrateRoot(container, app);  // Hydrate SSR HTML
} else {
  createRoot(container).render(app);  // Fallback to CSR
}
```

## Build Scripts

### `bun dev`
Start development server with Vite middleware and hot reload.

### `bun build`
```bash
# Full production build:
# 1. vite build (client SPA)
# 2. vite build --ssr src/entry-server.tsx (SSR bundle)
# 3. tsx prerender.ts (static HTML generation)
# 4. esbuild server.ts (production server bundle)
```

### `bun start`
Run production Express server serving prerendered pages.

### `bun lint`
Type-check with TypeScript (no code generation).

### `bun clean`
Remove `dist/` directory.

## Deployment

### Option 1: Static Hosting (Recommended)
Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages)

```bash
# Deploy prerendered files
bun build
# Upload dist/ folder
```

### Option 2: Traditional Server
Run `bun start` on any Node.js host

```bash
bun build
bun start
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `development` | `production` for static serving |
| `PORT` | `3000` | Server port |
| `DISABLE_HMR` | `false` | Disable Vite HMR (for AI Studio) |

## Conversion Algorithms

### Bijoy ↔ Unicode

**Bijoy (SutonnyMJ ANSI)** → **Unicode (Avro/Modern Bengali)**

- Handles complex Bengali conjuncts (যুক্তাক্ষর): ক্ষ, জ্ঞ, ত্ত, ঙ্ক, etc.
- Supports diacritics & Kaars (কার): া, ি, ী, ু, ূ, ে, ৈ, ো, ৌ
- Bidirectional: Unicode → Bijoy (beta, complex conjuncts may have edge cases)
- 240+ character mappings

### Number to Bengali Words

**Banking-grade precision** for checks, deeds, vouchers

- Supports up to 9,999 কোটি (~100 billion)
- Bengali numbering: হাজার, লক্ষ, কোটি (not million/billion)
- Colloquial variants: "পনেরশ" (1500) vs "এক হাজার পাঁচশত"
- Paisa (পয়সা) support for decimal amounts
- Bangladeshi comma formatting: ১২,৩৪,৫৬,৭৮৯

## Known Limitations

1. **Unicode → Bijoy Conversion:** Complex conjuncts may not convert perfectly (marked as "Beta")
2. **Image Resizing:** Client-side canvas limits ~5MB images
3. **Age Calculator:** Only handles dates within ±150 years
4. **No Offline Support:** Fonts load from Google Fonts (requires internet)

## Testing

```bash
# Run type checks
bun lint

# Manual testing
bun dev
# Visit http://localhost:3000 in browser
```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source. Check LICENSE file for details.

## Support & Issues

- 🐛 **Report Bugs:** [GitHub Issues](https://github.com/Rony-Mia/Utools.bd/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Rony-Mia/Utools.bd/discussions)
- 📧 **Contact:** See repository for contact info

## Credits

- **Bijoy Conversion Engine:** Based on SutonnyMJ font encoding standards
- **Icons:** Lucide React
- **Fonts:** Google Fonts
- **Inspiration:** Bengali digital tools community

---

**Made with ❤️ for Bengali digital tools. 100% browser-based. Your data, your privacy.**

**Utools.bd — প্রয়োজনীয় বাংলা ডিজিটাল ইউটিলিটি হাব**
