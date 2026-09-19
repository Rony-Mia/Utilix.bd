import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

export interface LoadedPdfInfo {
  doc: PDFDocument;
  buffer: ArrayBuffer;
  name: string;
  pageCount: number;
  sizeBytes: number;
}

/**
 * Load a PDFDocument from a browser File with robust error handling.
 * Checks for encrypted/password-protected PDFs and corrupted files.
 */
export async function loadPdf(file: File): Promise<PDFDocument> {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith('.pdf') && file.type !== 'application/pdf') {
    throw new Error(`"${file.name}": এটি একটি বৈধ পিডিএফ ফাইল নয়। শুধুমাত্র .pdf ফাইল যোগ করুন।`);
  }

  const buffer = await file.arrayBuffer();
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    return pdfDoc;
  } catch (err: unknown) {
    const errStr = String(err).toLowerCase();
    const errName = (err as { name?: string })?.name?.toLowerCase() || '';
    if (
      errName.includes('password') ||
      errStr.includes('password') ||
      errStr.includes('encrypted') ||
      errStr.includes('decrypt')
    ) {
      throw new Error(
        `"${file.name}": পাসওয়ার্ড-সুরক্ষিত পিডিএফ এখনো সাপোর্টেড না। অনুগ্রহ করে সুরক্ষা অপসারণ করে ফাইলটি দিন।`
      );
    }
    throw new Error(
      `"${file.name}": ফাইলটি ক্ষতিগ্রস্ত বা অবৈধ পিডিএফ (করাপ্টেড)। অনুগ্রহ করে সঠিক ফাইল যোগ করুন।`
    );
  }
}

/**
 * Loads a PDF file and returns complete metadata along with doc & buffer.
 */
export async function getPdfInfo(file: File): Promise<LoadedPdfInfo> {
  const buffer = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
  } catch (err: unknown) {
    const errStr = String(err).toLowerCase();
    const errName = (err as { name?: string })?.name?.toLowerCase() || '';
    if (
      errName.includes('password') ||
      errStr.includes('password') ||
      errStr.includes('encrypted') ||
      errStr.includes('decrypt')
    ) {
      throw new Error(
        `"${file.name}": পাসওয়ার্ড-সুরক্ষিত পিডিএফ এখনো সাপোর্টেড না। অনুগ্রহ করে সুরক্ষা অপসারণ করে ফাইলটি দিন।`
      );
    }
    throw new Error(
      `"${file.name}": ফাইলটি ক্ষতিগ্রস্ত বা অবৈধ পিডিএফ (করাপ্টেড)। অনুগ্রহ করে সঠিক ফাইল যোগ করুন।`
    );
  }

  const pageCount = doc.getPageCount();
  return {
    doc,
    buffer,
    name: file.name,
    pageCount,
    sizeBytes: file.size,
  };
}

/**
 * Trigger client-side download of a PDFDocument without server transmission.
 */
export async function downloadPdfBlob(pdfDoc: PDFDocument, filename: string): Promise<void> {
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Trigger client-side download from a raw Uint8Array PDF.
 */
export function downloadRawPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Trigger client-side download of a ZIP file using JSZip.
 */
export async function downloadZipBlob(zip: JSZip, filename: string): Promise<void> {
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.zip') ? filename : `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Convert Bengali digits into English standard digits.
 */
export function normalizeBanglaDigits(input: string): string {
  const banglaToEnglishMap: Record<string, string> = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
  };
  return input.replace(/[০-৯]/g, (d) => banglaToEnglishMap[d] ?? d);
}

/**
 * Parses user range strings (e.g. "1-3, 5, 7-9" or "১-৩, ৫, ৭-৯")
 * Returns array of 0-based page indices lists, one per range group.
 */
export function parsePageRangeString(
  rangeStr: string,
  totalPageCount: number
): { ranges: number[][]; invalidTokens: string[] } {
  const normalized = normalizeBanglaDigits(rangeStr);
  const tokens = normalized.split(/[,;\n]+/).map((t) => t.trim()).filter(Boolean);
  const ranges: number[][] = [];
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      const pageNum = parseInt(token, 10);
      if (pageNum >= 1 && pageNum <= totalPageCount) {
        ranges.push([pageNum - 1]);
      } else {
        invalidTokens.push(token);
      }
    } else if (/^\d+\s*-\s*\d+$/.test(token)) {
      const parts = token.split('-').map((p) => parseInt(p.trim(), 10));
      const start = Math.min(parts[0], parts[1]);
      const end = Math.max(parts[0], parts[1]);

      if (start >= 1 && end <= totalPageCount) {
        const group: number[] = [];
        for (let p = start; p <= end; p++) {
          group.push(p - 1);
        }
        ranges.push(group);
      } else {
        invalidTokens.push(token);
      }
    } else {
      invalidTokens.push(token);
    }
  }

  return { ranges, invalidTokens };
}

/**
 * Extract specific pages into a new PDFDocument.
 * pageIndices are 0-based.
 */
export async function extractPages(
  sourceDoc: PDFDocument,
  pageIndices: number[]
): Promise<PDFDocument> {
  const newDoc = await PDFDocument.create();
  const validIndices = pageIndices.filter((idx) => idx >= 0 && idx < sourceDoc.getPageCount());
  if (validIndices.length === 0) {
    throw new Error('কোনো বৈধ পেজ পাওয়া যায়নি।');
  }
  const copiedPages = await newDoc.copyPages(sourceDoc, validIndices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }
  return newDoc;
}

/**
 * Delete specified page indices from a source PDF and return a new PDFDocument.
 * pageIndicesToDelete are 0-based.
 */
export async function deletePages(
  sourceDoc: PDFDocument,
  pageIndicesToDelete: number[]
): Promise<PDFDocument> {
  const total = sourceDoc.getPageCount();
  const deleteSet = new Set(pageIndicesToDelete);
  const remainingIndices: number[] = [];

  for (let i = 0; i < total; i++) {
    if (!deleteSet.has(i)) {
      remainingIndices.push(i);
    }
  }

  if (remainingIndices.length === 0) {
    throw new Error('সবগুলো পেজ মুছে ফেলা যাবে না। কমপক্ষে একটি পেজ অবশ্যই রাখতে হবে।');
  }

  return extractPages(sourceDoc, remainingIndices);
}

/**
 * Rotate specific pages or all pages by given degrees.
 * rotationMap: map of 0-based page index to rotation delta in degrees (e.g. +90, -90, 180).
 */
export async function rotatePages(
  sourceDoc: PDFDocument,
  rotationMap: Map<number, number>
): Promise<PDFDocument> {
  // We can modify the sourceDoc or copy it
  const pageCount = sourceDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const delta = rotationMap.get(i);
    if (delta && delta !== 0) {
      const page = sourceDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      const newAngle = (currentRotation + delta) % 360;
      const normalizedAngle = (newAngle + 360) % 360;
      page.setRotation(degrees(normalizedAngle));
    }
  }
  return sourceDoc;
}

/**
 * Format bytes to readable string in Bengali.
 */
export function formatBytesBengali(bytes: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBn = (val: number | string) => String(val).replace(/\d/g, (d) => banglaDigits[Number(d)]);

  if (bytes < 1024) return `${toBn(bytes)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${toBn(kb.toFixed(1))} KB`;
  const mb = kb / 1024;
  return `${toBn(mb.toFixed(2))} MB`;
}

/**
 * Convert numbers to Bengali digits.
 */
export function toBanglaDigits(val: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/\d/g, (d) => banglaDigits[Number(d)] ?? d);
}

/**
 * Parses Hex color code (#ffffff, #f00, 00ff00) to RGB floats [0, 1].
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num) || cleaned.length !== 6) {
    return { r: 0.3, g: 0.3, b: 0.3 };
  }
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

/**
 * Tests if string contains solely standard ASCII characters (<= 127).
 */
export function isPureAscii(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) return false;
  }
  return true;
}

/**
 * Render text onto an off-screen canvas to produce a high-DPI transparent PNG.
 * Enables 100% crash-free Unicode and Bengali text embedding inside pdf-lib.
 */
export function renderTextToPngBytes(
  text: string,
  options: {
    fontSize: number;
    color: string;
    bold?: boolean;
    scale?: number;
    fontFamily?: string;
  }
): { bytes: Uint8Array; width: number; height: number } | null {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const dpr = options.scale ?? 2.5; // High-DPI for razor-sharp vector-like text
    const fontSize = options.fontSize;
    const weight = options.bold ? 'bold ' : '';
    const fontFamily =
      options.fontFamily ||
      "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', -apple-system, sans-serif";
    const fontSpec = `${weight}${Math.round(fontSize * dpr)}px ${fontFamily}`;

    ctx.font = fontSpec;
    const metrics = ctx.measureText(text);
    const textWidthPx = Math.ceil(metrics.width);
    const textHeightPx = Math.ceil(fontSize * 1.35 * dpr);

    // Physical dimensions in points for the PDF
    const targetWidthPt = textWidthPx / dpr;
    const targetHeightPt = textHeightPx / dpr;

    canvas.width = Math.max(textWidthPx + Math.round(8 * dpr), 10);
    canvas.height = Math.max(textHeightPx + Math.round(4 * dpr), 10);

    ctx.font = fontSpec;
    ctx.fillStyle = options.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, 4 * dpr, canvas.height / 2);

    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    if (!base64) return null;

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return {
      bytes,
      width: targetWidthPt,
      height: targetHeightPt,
    };
  } catch {
    return null;
  }
}

// Types for Page Numbers
export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type PageNumberFormat =
  | 'page_x_of_y' // "Page 1 of 10"
  | 'x_of_y' // "1 of 10"
  | 'number_only' // "1"
  | 'page_x' // "Page 1"
  | 'bn_page_x' // "পৃষ্ঠা ১"
  | 'bn_page_x_of_y' // "পৃষ্ঠা ১ এর ১০"
  | 'bn_number_only' // "১"
  | 'custom'; // Custom Prefix/Suffix

export interface PageNumberOptions {
  position?: PageNumberPosition;
  fontSize?: number;
  opacity?: number;
  startNumber?: number;
  format?: PageNumberFormat;
  customPrefix?: string;
  customSuffix?: string;
  useBanglaDigits?: boolean;
  color?: string; // Hex color
  margin?: number; // Distance in pt from border
}

/**
 * Add page numbers to all pages of a PDFDocument.
 */
export async function addPageNumbers(
  pdfDoc: PDFDocument,
  options: PageNumberOptions = {}
): Promise<PDFDocument> {
  const position = options.position ?? 'bottom-center';
  const fontSize = options.fontSize ?? 11;
  const opacity = Math.min(Math.max(options.opacity ?? 0.85, 0.05), 1.0);
  const startNumber = options.startNumber ?? 1;
  const format = options.format ?? 'page_x_of_y';
  const colorHex = options.color ?? '#333333';
  const margin = options.margin ?? 25;
  const useBangla = options.useBanglaDigits ?? false;

  const rgbColor = hexToRgb(colorHex);
  const totalPages = pdfDoc.getPageCount();

  // Embed standard font for pure ASCII text
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageNum = startNumber + i;

    // Generate formatted label
    let label = '';
    const numStr = useBangla ? toBanglaDigits(pageNum) : String(pageNum);
    const totalStr = useBangla ? toBanglaDigits(totalPages) : String(totalPages);

    switch (format) {
      case 'page_x_of_y':
        label = `Page ${numStr} of ${totalStr}`;
        break;
      case 'x_of_y':
        label = `${numStr} of ${totalStr}`;
        break;
      case 'number_only':
        label = `${numStr}`;
        break;
      case 'page_x':
        label = `Page ${numStr}`;
        break;
      case 'bn_page_x':
        label = `পৃষ্ঠা ${toBanglaDigits(pageNum)}`;
        break;
      case 'bn_page_x_of_y':
        label = `পৃষ্ঠা ${toBanglaDigits(pageNum)} এর ${toBanglaDigits(totalPages)}`;
        break;
      case 'bn_number_only':
        label = `${toBanglaDigits(pageNum)}`;
        break;
      case 'custom':
        label = `${options.customPrefix ?? ''}${numStr}${options.customSuffix ?? ''}`;
        break;
      default:
        label = `Page ${numStr} of ${totalStr}`;
    }

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    // Check whether label can be drawn with standard ASCII vector font
    const ascii = isPureAscii(label);

    if (ascii) {
      const textWidth = helveticaFont.widthOfTextAtSize(label, fontSize);
      let x = margin;
      let y = margin;

      // X coordinate
      if (position === 'top-left' || position === 'bottom-left') {
        x = margin;
      } else if (position === 'top-center' || position === 'bottom-center') {
        x = (pageWidth - textWidth) / 2;
      } else {
        x = pageWidth - margin - textWidth;
      }

      // Y coordinate
      if (position.startsWith('top-')) {
        y = pageHeight - margin - fontSize;
      } else {
        y = margin;
      }

      page.drawText(label, {
        x,
        y,
        size: fontSize,
        font: helveticaFont,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity,
      });
    } else {
      // Non-ASCII (Bengali characters): Render via canvas PNG
      const rendered = renderTextToPngBytes(label, {
        fontSize,
        color: colorHex,
        bold: false,
        scale: 2.5,
      });

      if (rendered) {
        const embeddedImg = await pdfDoc.embedPng(rendered.bytes);
        const textWidth = rendered.width;
        const textHeight = rendered.height;

        let x = margin;
        let y = margin;

        if (position === 'top-left' || position === 'bottom-left') {
          x = margin;
        } else if (position === 'top-center' || position === 'bottom-center') {
          x = (pageWidth - textWidth) / 2;
        } else {
          x = pageWidth - margin - textWidth;
        }

        if (position.startsWith('top-')) {
          y = pageHeight - margin - textHeight;
        } else {
          y = margin;
        }

        page.drawImage(embeddedImg, {
          x,
          y,
          width: textWidth,
          height: textHeight,
          opacity,
        });
      } else {
        // Fallback for headless environments without canvas
        const fallbackAscii = `Page ${pageNum} of ${totalPages}`;
        const textWidth = helveticaFont.widthOfTextAtSize(fallbackAscii, fontSize);
        let x = (pageWidth - textWidth) / 2;
        let y = margin;
        if (position.startsWith('top-')) y = pageHeight - margin - fontSize;
        page.drawText(fallbackAscii, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity,
        });
      }
    }
  }

  return pdfDoc;
}

// Types for Watermark
export type WatermarkType = 'text' | 'image';
export type WatermarkPosition = 'center' | 'tile';

export interface WatermarkOptions {
  type: WatermarkType;
  // Text options
  text?: string;
  textColor?: string;
  fontSize?: number;
  rotationDegrees?: number;

  // Image options
  imageBytes?: Uint8Array | ArrayBuffer;
  imageFormat?: 'png' | 'jpg' | 'jpeg';
  imageScale?: number;

  // Placement & Styling
  opacity?: number; // 0.05 to 1.0 (default 0.22)
  position?: WatermarkPosition; // 'center' | 'tile'
  tileSpacingX?: number; // spacing for tiled pattern
  tileSpacingY?: number;
}

/**
 * Add custom text or image watermark to all pages of a PDFDocument.
 */
export async function addWatermark(
  pdfDoc: PDFDocument,
  options: WatermarkOptions
): Promise<PDFDocument> {
  const type = options.type;
  const opacity = Math.min(Math.max(options.opacity ?? 0.22, 0.02), 1.0);
  const position = options.position ?? 'center';
  const rotationDegrees = options.rotationDegrees ?? -45;
  const rotationRad = (rotationDegrees * Math.PI) / 180;
  const cosAngle = Math.cos(rotationRad);
  const sinAngle = Math.sin(rotationRad);

  const pages = pdfDoc.getPages();
  if (pages.length === 0) return pdfDoc;

  if (type === 'image' && options.imageBytes) {
    // Image Watermark
    const isJpg = options.imageFormat === 'jpg' || options.imageFormat === 'jpeg';
    const embeddedImg = isJpg
      ? await pdfDoc.embedJpg(options.imageBytes)
      : await pdfDoc.embedPng(options.imageBytes);

    const baseScale = options.imageScale ?? 0.45;
    const imgWidth = embeddedImg.width * baseScale;
    const imgHeight = embeddedImg.height * baseScale;

    for (const page of pages) {
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();

      if (position === 'center') {
        const x0 = pageWidth / 2 - (imgWidth / 2 * cosAngle - imgHeight / 2 * sinAngle);
        const y0 = pageHeight / 2 - (imgWidth / 2 * sinAngle + imgHeight / 2 * cosAngle);

        page.drawImage(embeddedImg, {
          x: x0,
          y: y0,
          width: imgWidth,
          height: imgHeight,
          rotate: degrees(rotationDegrees),
          opacity,
        });
      } else {
        // Tile pattern across page
        const stepX = options.tileSpacingX ?? Math.max(imgWidth * 1.5, 200);
        const stepY = options.tileSpacingY ?? Math.max(imgHeight * 1.5, 160);

        let rowIdx = 0;
        for (let y = -80; y <= pageHeight + 120; y += stepY) {
          const xOffset = rowIdx % 2 === 0 ? 0 : stepX / 2;
          for (let x = -80; x <= pageWidth + 120; x += stepX) {
            const currentX = x + xOffset;
            const x0 = currentX - (imgWidth / 2 * cosAngle - imgHeight / 2 * sinAngle);
            const y0 = y - (imgWidth / 2 * sinAngle + imgHeight / 2 * cosAngle);

            page.drawImage(embeddedImg, {
              x: x0,
              y: y0,
              width: imgWidth,
              height: imgHeight,
              rotate: degrees(rotationDegrees),
              opacity,
            });
          }
          rowIdx++;
        }
      }
    }
  } else {
    // Text Watermark
    const text = (options.text || 'CONFIDENTIAL').trim();
    const fontSize = options.fontSize ?? 48;
    const colorHex = options.textColor ?? '#666666';
    const rgbColor = hexToRgb(colorHex);
    const ascii = isPureAscii(text);

    if (ascii) {
      // Pure ASCII text: embed HelveticaBold vector font
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const textWidth = helveticaBold.widthOfTextAtSize(text, fontSize);
      const textHeight = fontSize * 0.8;

      for (const page of pages) {
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        if (position === 'center') {
          const x0 = pageWidth / 2 - (textWidth / 2 * cosAngle - textHeight / 2 * sinAngle);
          const y0 = pageHeight / 2 - (textWidth / 2 * sinAngle + textHeight / 2 * cosAngle);

          page.drawText(text, {
            x: x0,
            y: y0,
            size: fontSize,
            font: helveticaBold,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            rotate: degrees(rotationDegrees),
            opacity,
          });
        } else {
          // Tiled Pattern
          const stepX = options.tileSpacingX ?? Math.max(textWidth * 1.4, 220);
          const stepY = options.tileSpacingY ?? Math.max(fontSize * 4.5, 170);

          let rowIdx = 0;
          for (let y = -80; y <= pageHeight + 120; y += stepY) {
            const xOffset = rowIdx % 2 === 0 ? 0 : stepX / 2;
            for (let x = -80; x <= pageWidth + 120; x += stepX) {
              const currentX = x + xOffset;
              const x0 = currentX - (textWidth / 2 * cosAngle - textHeight / 2 * sinAngle);
              const y0 = y - (textWidth / 2 * sinAngle + textHeight / 2 * cosAngle);

              page.drawText(text, {
                x: x0,
                y: y0,
                size: fontSize,
                font: helveticaBold,
                color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
                rotate: degrees(rotationDegrees),
                opacity,
              });
            }
            rowIdx++;
          }
        }
      }
    } else {
      // Non-ASCII (Bengali words like "গোপনীয়", "খসড়া", etc.): Render via high-DPI canvas PNG
      const rendered = renderTextToPngBytes(text, {
        fontSize,
        color: colorHex,
        bold: true,
        scale: 2.5,
      });

      if (rendered) {
        const embeddedImg = await pdfDoc.embedPng(rendered.bytes);
        const imgWidth = rendered.width;
        const imgHeight = rendered.height;

        for (const page of pages) {
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();

          if (position === 'center') {
            const x0 = pageWidth / 2 - (imgWidth / 2 * cosAngle - imgHeight / 2 * sinAngle);
            const y0 = pageHeight / 2 - (imgWidth / 2 * sinAngle + imgHeight / 2 * cosAngle);

            page.drawImage(embeddedImg, {
              x: x0,
              y: y0,
              width: imgWidth,
              height: imgHeight,
              rotate: degrees(rotationDegrees),
              opacity,
            });
          } else {
            // Tiled Pattern
            const stepX = options.tileSpacingX ?? Math.max(imgWidth * 1.4, 220);
            const stepY = options.tileSpacingY ?? Math.max(imgHeight * 2.2, 170);

            let rowIdx = 0;
            for (let y = -80; y <= pageHeight + 120; y += stepY) {
              const xOffset = rowIdx % 2 === 0 ? 0 : stepX / 2;
              for (let x = -80; x <= pageWidth + 120; x += stepX) {
                const currentX = x + xOffset;
                const x0 = currentX - (imgWidth / 2 * cosAngle - imgHeight / 2 * sinAngle);
                const y0 = y - (imgWidth / 2 * sinAngle + imgHeight / 2 * cosAngle);

                page.drawImage(embeddedImg, {
                  x: x0,
                  y: y0,
                  width: imgWidth,
                  height: imgHeight,
                  rotate: degrees(rotationDegrees),
                  opacity,
                });
              }
              rowIdx++;
            }
          }
        }
      } else {
        // Fallback for Node test runs without DOM
        const fallbackAscii = 'CONFIDENTIAL';
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const textWidth = helveticaBold.widthOfTextAtSize(fallbackAscii, fontSize);
        const textHeight = fontSize * 0.8;
        for (const page of pages) {
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();
          const x0 = pageWidth / 2 - (textWidth / 2 * cosAngle - textHeight / 2 * sinAngle);
          const y0 = pageHeight / 2 - (textWidth / 2 * sinAngle + textHeight / 2 * cosAngle);
          page.drawText(fallbackAscii, {
            x: x0,
            y: y0,
            size: fontSize,
            font: helveticaBold,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            rotate: degrees(rotationDegrees),
            opacity,
          });
        }
      }
    }
  }

  return pdfDoc;
}
