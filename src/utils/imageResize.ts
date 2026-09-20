// Shared Canvas-Based Image Resizer and Binary-Search Target Size Compressor
// Used by PhotoResizerPage (single image) and BulkPhotoResizerPage (batch images)

export interface ResizeOptions {
  width: number;
  height: number;
  maxKb?: number;
  format?: 'jpeg' | 'png' | 'webp';
  fitMode?: 'cover' | 'contain' | 'fill';
  backgroundColor?: string;
  zoom?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface ResizeResult {
  dataUrl: string;
  blob?: Blob;
  width: number;
  height: number;
  sizeKb: number;
  format: string;
  qualityUsed: number;
}

/**
 * Calculates exact byte length of a base64 Data URL without converting to Blob
 */
export function getDataUrlByteLength(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return 0;
  const base64Str = dataUrl.slice(commaIdx + 1);
  const padding = base64Str.endsWith('==') ? 2 : base64Str.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64Str.length * 3) / 4) - padding);
}

/**
 * Converts a Base64 Data URL to a native Blob efficiently
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binaryStr = atob(parts[1]);
  const len = binaryStr.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Asynchronously loads an image from a URL, DataURL, File, or Blob
 */
export function loadImage(source: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (typeof source === 'string') {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('ছবি লোড করা যায়নি (ফাইলটি ক্ষতিগ্রস্ত হতে পারে)।'));
      img.src = source;
    } else {
      const url = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('ছবি লোড করা যায়নি (ফাইলটি ক্ষতিগ্রস্ত হতে পারে)।'));
      };
      img.src = url;
    }
  });
}

/**
 * Core 100% Client-Side Canvas Image Processing with Binary Search Compression
 */
export function resizeImage(
  source: HTMLImageElement,
  options: ResizeOptions
): ResizeResult {
  const {
    width,
    height,
    maxKb = 0,
    format = 'jpeg',
    fitMode = 'cover',
    backgroundColor = '#ffffff',
    zoom = 1,
    rotation = 0,
    offsetX = 0,
    offsetY = 0
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context পাওয়া যায়নি');
  }

  // Background fill (white by default for govt/passport requirements)
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(zoom, zoom);

  const srcW = source.naturalWidth || source.width || width;
  const srcH = source.naturalHeight || source.height || height;

  let drawW = width;
  let drawH = height;

  if (fitMode === 'cover') {
    const scale = Math.max(width / srcW, height / srcH);
    drawW = srcW * scale;
    drawH = srcH * scale;
  } else if (fitMode === 'contain') {
    const scale = Math.min(width / srcW, height / srcH);
    drawW = srcW * scale;
    drawH = srcH * scale;
  } else {
    // stretch / fill
    drawW = width;
    drawH = height;
  }

  ctx.drawImage(source, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  const outputMime =
    format === 'png'
      ? 'image/png'
      : format === 'webp'
      ? 'image/webp'
      : 'image/jpeg';

  let finalDataUrl = '';
  let finalQuality = 100;
  let finalBytes = 0;

  if (outputMime === 'image/png') {
    finalDataUrl = canvas.toDataURL('image/png');
    finalBytes = getDataUrlByteLength(finalDataUrl);
    finalQuality = 100;
  } else {
    const targetBytes = maxKb > 0 ? maxKb * 1024 : Infinity;

    // Test high quality first (0.98)
    const highCandidateQuality = 0.98;
    const highCandidateDataUrl = canvas.toDataURL(outputMime, highCandidateQuality);
    const highCandidateBytes = getDataUrlByteLength(highCandidateDataUrl);

    if (highCandidateBytes <= targetBytes || targetBytes === Infinity) {
      finalDataUrl = highCandidateDataUrl;
      finalQuality = Math.round(highCandidateQuality * 100);
      finalBytes = highCandidateBytes;
    } else {
      // Binary search in range [0.05, 0.98] to hit target size with optimal quality
      let low = 0.05;
      let high = highCandidateQuality;
      let bestDataUrl = canvas.toDataURL(outputMime, low);
      let bestBytes = getDataUrlByteLength(bestDataUrl);
      let bestQuality = low;

      // 8 iterations gives ~0.36% quality precision
      for (let iter = 0; iter < 8; iter++) {
        const mid = (low + high) / 2;
        const testDataUrl = canvas.toDataURL(outputMime, mid);
        const testBytes = getDataUrlByteLength(testDataUrl);

        if (testBytes <= targetBytes) {
          bestDataUrl = testDataUrl;
          bestBytes = testBytes;
          bestQuality = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      finalDataUrl = bestDataUrl;
      finalQuality = Math.round(bestQuality * 100);
      finalBytes = bestBytes;
    }
  }

  return {
    dataUrl: finalDataUrl,
    width,
    height,
    sizeKb: Number((finalBytes / 1024).toFixed(1)),
    format: format.toUpperCase(),
    qualityUsed: finalQuality
  };
}
