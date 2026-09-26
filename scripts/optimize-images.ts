import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
const OPTIMIZED_DIR = path.resolve(UPLOADS_DIR, 'optimized');

// Supported input extensions
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function optimizeImages() {
  console.log('[optimize-images] Checking uploads directory for blog images...');

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  // Scan content/blog/*.json to collect all referenced images
  const blogDir = path.resolve(process.cwd(), 'content/blog');
  const referencedImages = new Set<string>();

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(blogDir, file), 'utf-8'));
        if (content.image && typeof content.image === 'string') {
          const clean = content.image.replace(/^\/?uploads\//, '');
          referencedImages.add(clean);
        }
      } catch (err) {
        console.warn(`[optimize-images] Could not parse blog file: ${file}`, err);
      }
    }
  }

  // Scan public/uploads directory directly as well
  const allUploads = fs
    .readdirSync(UPLOADS_DIR)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return VALID_EXTS.has(ext) && !fs.statSync(path.join(UPLOADS_DIR, f)).isDirectory();
    });

  const targets = Array.from(new Set([...referencedImages, ...allUploads])).filter((filename) => {
    return fs.existsSync(path.join(UPLOADS_DIR, filename));
  });

  if (targets.length === 0) {
    console.log('[optimize-images] No blog images to process in public/uploads.');
    return;
  }

  console.log(`[optimize-images] Found ${targets.length} image(s) to check/optimize.`);

  const widths = [640, 1024, 1600];

  for (const filename of targets) {
    const srcPath = path.join(UPLOADS_DIR, filename);
    const srcStat = fs.statSync(srcPath);
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);

    const fallbackPath = path.join(OPTIMIZED_DIR, `${baseName}-fallback${ext}`);
    const needFallback =
      !fs.existsSync(fallbackPath) || fs.statSync(fallbackPath).mtimeMs < srcStat.mtimeMs;

    // Check WebP variants
    let needsProcessing = needFallback;
    for (const w of widths) {
      const outWebp = path.join(OPTIMIZED_DIR, `${baseName}-${w}.webp`);
      if (!fs.existsSync(outWebp) || fs.statSync(outWebp).mtimeMs < srcStat.mtimeMs) {
        needsProcessing = true;
        break;
      }
    }

    if (!needsProcessing) {
      console.log(`[optimize-images] Skipping (up-to-date): ${filename}`);
      continue;
    }

    console.log(`[optimize-images] Processing: ${filename}`);

    try {
      const imageInstance = sharp(srcPath);
      const metadata = await imageInstance.metadata();
      const origWidth = metadata.width || 1600;

      // 1. Generate WebP sizes: 640w, 1024w, 1600w
      for (const w of widths) {
        const outWebp = path.join(OPTIMIZED_DIR, `${baseName}-${w}.webp`);
        const targetWidth = Math.min(w, origWidth);

        await sharp(srcPath)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .webp({ quality: w <= 640 ? 80 : w <= 1024 ? 82 : 85, effort: 4 })
          .toFile(outWebp);
      }

      // 2. Generate compressed fallback in original format
      if (ext === '.png') {
        await sharp(srcPath)
          .resize({ width: Math.min(1200, origWidth), withoutEnlargement: true })
          .png({ compressionLevel: 8, palette: true })
          .toFile(fallbackPath);
      } else {
        await sharp(srcPath)
          .resize({ width: Math.min(1200, origWidth), withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(fallbackPath);
      }

      console.log(`[optimize-images] Successfully generated responsive variants for ${filename}`);
    } catch (err) {
      console.error(`[optimize-images] Error optimizing ${filename}:`, err);
    }
  }

  console.log('[optimize-images] Image optimization complete.');
}

optimizeImages().catch((err) => {
  console.error('[optimize-images] Failed:', err);
  process.exit(1);
});
